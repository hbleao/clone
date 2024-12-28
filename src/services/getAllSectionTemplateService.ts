import type { SectionTemplate } from "@/types/section";

interface GetTemplatesResponse {
	success: boolean;
	data?: SectionTemplate[];
	error?: {
		message: string;
		code: "NOT_FOUND" | "SERVER_ERROR" | "NETWORK_ERROR";
		details?: unknown;
	};
}

/**
 * Busca todos os templates de seção de um app
 * @param slug - Slug do app
 * @returns Promise com a resposta tipada
 */
export async function getAllSectionTemplateService(
	slug: string,
): Promise<GetTemplatesResponse> {
	console.log("Fetching templates for slug:", slug);

	if (!slug) {
		console.error("No slug provided");
		return {
			success: false,
			error: {
				message: "Slug do app é obrigatório",
				code: "NOT_FOUND",
			},
		};
	}

	try {
		const response = await fetch(`/api/apps/${slug}/templates`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store", // Desabilitar cache para garantir dados frescos
		});

		const data = await response.json();

		if (!response.ok) {
			// Trata erros específicos da API
			if (response.status === 404) {
				console.error("App não encontrado:", data);
				return {
					success: false,
					error: {
						message: "App não encontrado",
						code: "NOT_FOUND",
						details: data.error,
					},
				};
			}

			console.error("Erro ao buscar templates:", data);
			return {
				success: false,
				error: {
					message: data.error || "Erro ao buscar templates",
					code: "SERVER_ERROR",
					details: data.error,
				},
			};
		}

		// Valida se os dados retornados são um array
		if (!Array.isArray(data)) {
			console.error("Formato de resposta inválido:", data);
			return {
				success: false,
				error: {
					message: "Formato de resposta inválido",
					code: "SERVER_ERROR",
				},
			};
		}

		// Converte as datas de string para Date e valida templates
		const templates: SectionTemplate[] = data.reduce((acc, template, index) => {
			try {
				// Valida campos obrigatórios
				if (!template.id || !template.name) {
					console.warn("Template inválido (sem id ou nome):", template);
					return acc;
				}

				const processedTemplate: SectionTemplate = {
					...template,
					createdAt: new Date(template.createdAt),
					updatedAt: new Date(template.updatedAt),
					// Converte os campos JSON de string para objeto
					schema:
						typeof template.schema === "string"
							? JSON.parse(template.schema)
							: template.schema,
					defaultData:
						template.defaultData && typeof template.defaultData === "string"
							? JSON.parse(template.defaultData)
							: template.defaultData || {},
				};

				// Validação adicional do schema
				if (
					!processedTemplate.schema ||
					!Array.isArray(processedTemplate.schema.fields)
				) {
					console.warn("Template com schema inválido:", processedTemplate);
					return acc;
				}

				return [...acc, processedTemplate];
			} catch (error) {
				console.error(`Erro ao processar template ${index}:`, error);
				return acc;
			}
		}, [] as SectionTemplate[]);

		// Verifica se há templates válidos
		if (templates.length === 0) {
			console.warn("Nenhum template válido encontrado");
			return {
				success: false,
				error: {
					message: "Nenhum template válido encontrado",
					code: "NOT_FOUND",
				},
			};
		}

		return {
			success: true,
			data: templates,
		};
	} catch (error) {
		console.error("Erro inesperado ao buscar templates:", error);
		return {
			success: false,
			error: {
				message: "Erro inesperado ao buscar templates",
				code: "NETWORK_ERROR",
				details: error,
			},
		};
	}
}
