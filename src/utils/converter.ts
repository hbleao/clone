import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

interface FileOrFolder {
	name: string;
	isDirectory: boolean;
	path: string;
}

interface ComponentData {
	name: string;
	type: string;
	schema?: string;
	content?: string;
	appId: string;
}

// Mapeamento de nomes de componentes JSON para nomes de componentes do sistema
const COMPONENT_NAME_MAP: Record<string, string> = {
	section_custom_data: "CustomData",
	section_breadcrumb: "Breadcrumb",
	section_banner_hero: "bannerhero",
	section_card_price_with_text: "CardPrice",
	section_banner_body: "BannerBody",
	section_how_it_works: "CardIcon",
	section_card_content_side_by_side: "CardContent",
	section_service_requirements: "CardIcon",
	section_cards_carousel_testimonial: "CardsTestimonial",
	section_faq: "Accordion",
};

// Mapeamento de estrutura de dados para cada tipo de componente
const COMPONENT_STRUCTURE_MAP: Record<
	string,
	(data: any) => { defaultData: any; content: any }
> = {
	CustomData: (data: any) => ({
		defaultData: {
			pageName: "",
			product: "",
			subproduct: "",
			category: "",
			vertical: "",
			funnel: "",
		},
		content: {
			pageName: data.component.pageName,
			product: data.component.product,
			subproduct: data.component.subproduct,
			category: data.component.category,
			vertical: data.component.vertical,
			funnel: data.component.funnel,
		},
	}),
	Breadcrumb: (data: any) => ({
		defaultData: {
			marginBottom: "",
			theme: "light",
			links: [],
		},
		content: {
			marginBottom: data.component.marginBottom || "",
			theme: data.component.theme || "light",
			links: data.component.links || [],
		},
	}),
	bannerhero: (data: any) => ({
		defaultData: {},
		content: data.component || {},
	}),
	CardPrice: (data: any) => ({
		defaultData: {
			title: "",
			description: "",
			price: 0,
			benefits: [],
		},
		content: {
			title: data.component.title,
			description: data.component.description,
			price: data.component.price,
			benefits: data.component.benefits || [],
		},
	}),
	BannerBody: (data: any) => ({
		defaultData: {},
		content: data.component || {},
	}),
	CardIcon: (data: any) => ({
		defaultData: {
			theme: "light",
			title: "",
			variant: "",
			sectionTitle: "",
			cardIcons: [],
			requirements: [],
		},
		content: {
			theme: data.component.theme || "light",
			title: data.component.title,
			variant: data.component.variant,
			sectionTitle: data.component.sectionTitle,
			cardIcons: data.component.cardIcons || [],
			requirements: data.component.requirements || [],
		},
	}),
	CardContent: (data: any) => ({
		defaultData: {
			sectionTitle: "",
			cardsContent: [],
		},
		content: {
			sectionTitle: data.component.sectionTitle,
			cardsContent: data.component.cardsContent || [],
		},
	}),
	CardsTestimonial: (data: any) => ({
		defaultData: {
			theme: "light",
			sectionTitle: "",
			cards: [],
		},
		content: {
			theme: data.component.theme || "light",
			sectionTitle: data.component.sectionTitle,
			cards: data.component.cards || [],
		},
	}),
	Accordion: (data: any) => ({
		defaultData: {
			sectionTitle: "",
			questionsAndAnswers: [],
			allBorder: "",
			allNegative: false,
		},
		content: {
			sectionTitle: data.component.sectionTitle,
			questionsAndAnswers: data.component.questionsAndAnswers || [],
			allBorder: data.component.allBorder,
			allNegative: data.component.allNegative,
		},
	}),
};

export const listFilesAndFolders = async (
	folderPath: string,
): Promise<FileOrFolder[]> => {
	try {
		const files = await fs.readdir(folderPath);

		const filesAndFolders = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(folderPath, file);
				const stats = await fs.stat(filePath);

				return {
					name: file,
					isDirectory: stats.isDirectory(),
					path: filePath,
				};
			}),
		);

		return filesAndFolders;
	} catch (error) {
		console.error("Error reading directory:", error);
		return [];
	}
};

export const readJsonFile = async (filePath: string) => {
	try {
		const fileContents = await fs.readFile(filePath, "utf8");
		return JSON.parse(fileContents);
	} catch (error) {
		console.error(`Erro ao ler o arquivo ${filePath}:`, error);
		return null;
	}
};

export const readAllJsonFiles = async (folderPath: string) => {
	try {
		const files = await fs.readdir(folderPath);

		const jsonFiles = files.filter((file) => path.extname(file) === ".json");

		const jsonContents = await Promise.all(
			jsonFiles.map(async (file) => {
				const filePath = path.join(folderPath, file);
				const content = await readJsonFile(filePath);
				return {
					filename: file,
					content: content,
				};
			}),
		);

		return jsonContents;
	} catch (error) {
		console.error("Erro ao ler arquivos JSON:", error);
		return [];
	}
};

export const convertAndSaveComponents = async (
	jsonContent: any[],
	appId: string,
	pageName: string,
) => {
	try {
		// Verifica se a página já existe
		const existingPage = await prisma.page.findFirst({
			where: {
				appId,
				slug: convertToSlug(pageName),
			},
		});

		if (existingPage) {
			console.log(`Página "${pageName}" já existe, atualizando conteúdo...`);
		} else {
			console.log(`Criando nova página "${pageName}"...`);
		}

		// Busca todos os componentes registrados no Prisma
		const registeredComponents = await prisma.component.findMany({
			where: { appId },
			select: {
				id: true,
				name: true,
				type: true,
				schema: true,
			},
		});

		console.log("\nComponentes registrados no app:");
		registeredComponents.forEach((c) => {
			console.log(`- ${c.name} (${c.id})`);
			console.log("  Schema:", c.schema);
		});

		// Cria um mapa de nomes de componentes para fácil acesso
		const componentMap = new Map(
			registeredComponents.map((c) => [c.name.toLowerCase(), c]),
		);

		// Array para armazenar os componentes convertidos
		const convertedComponents = [];

		// Analisa cada seção do JSON
		console.log("\nProcessando seções do JSON:");
		for (const section of jsonContent) {
			const sectionName = section.name?.toLowerCase();
			console.log(`\nProcessando seção: "${sectionName}"`);
			console.log("Dados da seção:", JSON.stringify(section, null, 2));

			if (!sectionName) {
				console.warn("❌ Seção sem nome encontrada, pulando...");
				continue;
			}

			const mappedName = COMPONENT_NAME_MAP[sectionName];
			console.log(
				`Mapeamento encontrado: "${sectionName}" -> "${mappedName || "não encontrado"}"`,
			);

			if (!mappedName) {
				console.warn(
					`❌ Mapeamento não encontrado para o componente "${sectionName}"`,
				);
				continue;
			}

			// Verifica se o nome mapeado do componente está registrado
			const mappedNameLower = mappedName.toLowerCase();
			const component = componentMap.get(mappedNameLower);

			if (component) {
				console.log(`Componente encontrado no banco:`, component);

				// Usa o mapeador de estrutura específico para o componente ou um mapeador padrão
				const structureMapper =
					COMPONENT_STRUCTURE_MAP[mappedName] ||
					((data: any) => ({ defaultData: {}, content: data.component || {} }));
				const mappedData = structureMapper(section);

				console.log(`Dados mapeados:`, JSON.stringify(mappedData, null, 2));

				try {
					// Tenta fazer o parse do schema do componente
					let schema = {};
					try {
						schema = JSON.parse(component.schema);
					} catch (e) {
						console.warn(
							`Erro ao fazer parse do schema do componente ${mappedName}:`,
							e,
						);
					}

					// Prepara os dados do componente no formato esperado pelo PageBuilder
					const componentData = {
						id: nanoid(), // Gera um ID único para a seção
						type: "section",
						template: {
							id: component.id,
							name: component.name,
							type: component.type || "section",
							schema: schema,
							defaultData: mappedData.defaultData,
						},
						content: mappedData.content,
					};

					console.log(
						`Componente final:`,
						JSON.stringify(componentData, null, 2),
					);

					convertedComponents.push(componentData);
					console.log(
						`✓ Componente "${sectionName}" mapeado para "${mappedName}" e convertido com sucesso`,
					);
				} catch (error) {
					console.error(`Erro ao processar schema do componente:`, error);
					continue;
				}
			} else {
				console.warn(
					`❌ Componente mapeado "${mappedName}" não encontrado no app ${appId}`,
				);
				console.log(
					"Componentes disponíveis:",
					Array.from(componentMap.keys()),
				);
			}
		}

		// Cria ou atualiza a página
		const pageContent = {
			sections: convertedComponents,
		};

		console.log(
			"\nConteúdo final da página:",
			JSON.stringify(pageContent, null, 2),
		);

		const page = await prisma.page.upsert({
			where: {
				appId_slug: {
					appId,
					slug: convertToSlug(pageName),
				},
			},
			create: {
				title: pageName,
				slug: convertToSlug(pageName),
				content: JSON.stringify(pageContent),
				type: "page",
				author: "system",
				appId,
				status: "draft",
				seo: {
					create: {
						title: pageName,
						description: `Página ${pageName}`,
						robots: "index, follow",
					},
				},
			},
			update: {
				content: JSON.stringify(pageContent),
				updatedAt: new Date(),
			},
		});

		return {
			success: true,
			pageId: page.id,
			componentsConverted: convertedComponents.length,
			isNewPage: !existingPage,
		};
	} catch (error) {
		console.error("Erro ao converter e salvar componentes:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro desconhecido",
		};
	}
};

export const convertAllJsonsInDirectory = async (
	directoryPath: string,
	appId: string,
) => {
	try {
		// Verifica se o app existe
		const app = await prisma.app.findUnique({
			where: { id: appId },
		});

		if (!app) {
			throw new Error(`App com ID ${appId} não encontrado`);
		}

		// Lê todos os arquivos JSON do diretório
		const jsonFiles = await readAllJsonFiles(directoryPath);
		const results = [];

		console.log(
			`\nProcessando ${jsonFiles.length} arquivos JSON em ${directoryPath}...\n`,
		);

		// Processa cada arquivo
		for (const file of jsonFiles) {
			// Remove a extensão .json do nome do arquivo para usar como nome da página
			const pageName = path.basename(file.filename, ".json");

			console.log(`\nProcessando arquivo: ${file.filename}`);
			console.log(`Nome da página: ${pageName}`);

			// Converte e salva os componentes
			const result = await convertAndSaveComponents(
				file.content,
				appId,
				pageName,
			);

			if (result.success) {
				console.log(
					`✓ Página ${result.isNewPage ? "criada" : "atualizada"} com sucesso`,
				);
				console.log(`  - ID: ${result.pageId}`);
				console.log(
					`  - Componentes convertidos: ${result.componentsConverted}`,
				);
			} else {
				console.error(`✗ Erro ao processar ${file.filename}: ${result.error}`);
			}

			results.push({
				filename: file.filename,
				pageName,
				...result,
			});
		}

		const successful = results.filter((r) => r.success);
		const failed = results.filter((r) => !r.success);

		console.log("\nResumo da conversão:");
		console.log(`Total de arquivos: ${results.length}`);
		console.log(`Sucesso: ${successful.length}`);
		console.log(`Falhas: ${failed.length}`);

		return {
			success: true,
			totalProcessed: results.length,
			successful: successful.length,
			failed: failed.length,
			results,
		};
	} catch (error) {
		console.error("Erro ao processar diretório:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro desconhecido",
		};
	}
};

export const analyzeComponentStructure = (jsonContent: any) => {
	if (!Array.isArray(jsonContent)) {
		return {
			error: "O arquivo JSON não é um array de seções",
		};
	}

	const componentAnalysis = jsonContent.map((section, index) => {
		const analysis = {
			index,
			name: section.name || "Nome não encontrado",
			hasComponent: !!section.component,
			componentKeys: section.component ? Object.keys(section.component) : [],
			componentStructure: section.component
				? JSON.stringify(section.component, null, 2)
				: null,
		};

		return analysis;
	});

	return componentAnalysis;
};

export const convertToSlug = (text: string): string => {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const convertToCamelCase = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
};

export const convertToKebabCase = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-");
};

// Função principal para processar argumentos de linha de comando
const main = async () => {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log("Uso: npm run converter <comando> <argumento>");
		console.log("Comandos disponíveis:");
		console.log("  list [caminho] - Lista arquivos e pastas");
		console.log("  slug <texto> - Converte texto para slug");
		console.log("  camel <texto> - Converte texto para camelCase");
		console.log("  kebab <texto> - Converte texto para kebab-case");
		console.log(
			"  read <caminho-do-arquivo> - Lê o conteúdo de um arquivo JSON",
		);
		console.log(
			"  readall <caminho-do-diretorio> - Lê todos os JSONs de um diretório",
		);
		console.log(
			"  analyze <caminho-do-arquivo> - Analisa a estrutura de componentes de um JSON",
		);
		console.log(
			"  convert <caminho-do-arquivo> <app-id> <page-name> - Converte e salva componentes",
		);
		console.log(
			"  convertall <diretorio> <app-id> - Converte todos os JSONs do diretório",
		);
		return;
	}

	const comando = args[0];
	const argumento = args[1];

	switch (comando) {
		case "list":
			const caminho = argumento || process.cwd();
			const arquivos = await listFilesAndFolders(caminho);
			console.log(JSON.stringify(arquivos, null, 2));
			break;

		case "slug":
			if (!argumento) {
				console.error("Por favor, forneça um texto para converter");
				return;
			}
			console.log(convertToSlug(argumento));
			break;

		case "camel":
			if (!argumento) {
				console.error("Por favor, forneça um texto para converter");
				return;
			}
			console.log(convertToCamelCase(argumento));
			break;

		case "kebab":
			if (!argumento) {
				console.error("Por favor, forneça um texto para converter");
				return;
			}
			console.log(convertToKebabCase(argumento));
			break;

		case "read":
			if (!argumento) {
				console.error("Por favor, forneça o caminho do arquivo JSON");
				return;
			}
			const conteudoJson = await readJsonFile(argumento);
			console.log(JSON.stringify(conteudoJson, null, 2));
			break;

		case "readall":
			if (!argumento) {
				console.error("Por favor, forneça o caminho do diretório");
				return;
			}
			const todosJsons = await readAllJsonFiles(argumento);
			console.log(JSON.stringify(todosJsons, null, 2));
			break;

		case "analyze":
			if (!argumento) {
				console.error("Por favor, forneça o caminho do arquivo JSON");
				return;
			}
			const jsonContent = await readJsonFile(argumento);
			const componentAnalysis = analyzeComponentStructure(jsonContent);
			console.log(JSON.stringify(componentAnalysis, null, 2));
			break;

		case "convert":
			if (!argumento || !args[2] || !args[3]) {
				console.error(
					"Por favor, forneça: caminho-do-arquivo app-id nome-da-pagina",
				);
				return;
			}
			const jsonToConvert = await readJsonFile(argumento);
			const result = await convertAndSaveComponents(
				jsonToConvert,
				args[2],
				args[3],
			);
			console.log(JSON.stringify(result, null, 2));
			break;

		case "convertall":
			if (!argumento || !args[2]) {
				console.error("Por favor, forneça: diretorio app-id");
				return;
			}
			const results = await convertAllJsonsInDirectory(argumento, args[2]);
			console.log(JSON.stringify(results, null, 2));
			break;

		default:
			console.log(`Comando desconhecido: ${comando}`);
	}
};

// Executa a função principal
main().catch(console.error);
