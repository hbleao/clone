import ExcelJS from 'exceljs';
import fs from 'node:fs';
import * as path from 'node:path';
import slugify from 'slugify';

function getUrlPathName(slug: string) {
	const URL_MAP = {
		'higienizacao-de-ar-condicionado': 'higienizacao-ar-condicionado',
		'check-up-e-troca-de-bateria': 'checkup-e-troca-de-bateria',
		'revisao-customizada': 'revisao-personalizada',
		'check-up-de-ferias': 'checkup-ferias',
		'troca-de-pastilha-de-freio': 'pastilha-de-freio',
		'cristalizacao-de-para-brisa-e-vidro-traseiro': 'cristalizacao',
		'cristalizacao-de-para-brisa-e-v': 'cristalizacao',
		'troca-de-palhetas-do-para-brisa': 'palheta-de-para-brisa',
	};

	return URL_MAP[slug] || slug;
}

function formatFileName(name: string): string {
	return slugify(name, {
		lower: true,
		strict: true,
	});
}

function removeUrlHost(url: string): string {
	return url.replace('https://www.portoseguro.com.br', '');
}

interface ParsedData {
	bannerHero: Record<string, string | null>;
	section_price: Record<string, string | null>;
	bannerBody: BannerBodyA;
	section_testimonials: SectionTestimonialsA;
	section_faq: SectionFaqA;
}

const ValidSections = {
	BANNER_HERO: 'BANNER HERO',
	SECTION_PRICE: 'O QUE É e PREÇO',
	BANNER_BODY: 'BANNER BODY',
	SECTION_TESTIMONIALS: 'O QUE DIZEM NOSSOS CLIENTES',
	SECTION_FAQ: 'TIRE SUAS DÚVIDAS',
};

const ignoredSections = new Set([
	'COMO FUNCIONA? (FIXO - NÃO MUDA)',
	'NOSSOS DIFERENCIAIS (FIXO - NÃO MUDA)',
	'INFORMAÇÕES IMPORTANTES (FIXO - NÃO MUDA)',
]);

const ignoredProps = new Set(['-> Por que é importante', 'Seção']);

function generateFileName(baseName: string, extension: string): string {
	return `${baseName}.${extension}`;
}

class XLSXReader {
	private filePath: string;

	constructor(filePath: string) {
		this.filePath = filePath;
	}

	public async read(): Promise<Record<string, (string | undefined)[][]>> {
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.readFile(this.filePath);
		const jsonData: Record<string, (string | undefined)[][]> = {};

		workbook.eachSheet((worksheet) => {
			const rows: (string | undefined)[][] = [];
			worksheet.eachRow((row) => {
				const rowData: (string | undefined)[] = [];
				row.eachCell((cell) => {
					rowData.push(cell.text);
				});
				rows.push(rowData);
			});
			jsonData[worksheet.name] = rows;
		});

		return jsonData;
	}
}

function processValue(value: string): string | null {
	if (value === '------- não se aplica para este serviço -------') {
		return null;
	}
	return value;
}

class DataParser {
	private parsedData: ParsedData;
	private currentSection: string | null;

	constructor() {
		this.parsedData = {
			bannerHero: {},
			section_price: {},
			bannerBody: {
				'@url-body-servico': '',
			},
			section_testimonials: {},
			section_faq: {},
		};
		this.currentSection = null;
	}

	public parseData(rows: (string | undefined)[][]): ParsedData {
		for (const row of rows) {
			this.parseRow(row);
		}
		return this.parsedData;
	}

	private parseRow(row: (string | undefined)[]): void {
		const [column1, column2] = row;

		if (this.isIgnoredSection(column1)) {
			this.currentSection = null;
		} else if (this.isValidSection(column1)) {
			this.currentSection = column1 as string;
		} else if (this.isValidData(column1, column2)) {
			this.processData(column1!, column2!);
		}
	}

	private isIgnoredSection(column: string | undefined): boolean {
		return column ? ignoredSections.has(column) : false;
	}

	private isValidSection(column: string | undefined): boolean {
		return column ? Object.values(ValidSections).includes(column) : false;
	}

	private isValidData(
		column1: string | undefined,
		column2: string | undefined,
	): boolean {
		return (
			this.currentSection !== null &&
			column1 !== undefined &&
			column2 !== undefined &&
			!ignoredProps.has(column1)
		);
	}

	private processData(column1: string, column2: string): void {
		const processedValue = processValue(column2);
		const column1LowerCase = column1.toLocaleLowerCase();

		switch (this.currentSection) {
			case ValidSections.BANNER_HERO:
				this.parsedData.bannerHero[column1LowerCase] = processedValue;
				break;
			case ValidSections.SECTION_PRICE:
				this.parsedData.section_price[column1LowerCase] = processedValue;
				break;
			case ValidSections.BANNER_BODY:
				this.parsedData.bannerBody[column1LowerCase] = processedValue;
				break;
			case ValidSections.SECTION_TESTIMONIALS:
				this.parsedData.section_testimonials[column1LowerCase] =
					processedValue as string;
				break;
			case ValidSections.SECTION_FAQ:
				this.parsedData.section_faq[column1LowerCase] =
					processedValue as string;
				break;
		}
	}
}

interface BannerHeroA {
	'@nome-do-servico': string;
	'@apoio': string;
	'@url-hero-servico': string;
	'@categoria': string;
}

interface SectionPriceA {
	'@descricao': string;
	'@preco': string;
}

interface BannerBodyA {
	'@url-body-servico': string | null;
	[key: string]: string | null;
}

interface SectionTestimonialsA {
	[key: string]: string;
}

interface SectionFaqA {
	[key: string]: string;
}

interface InputA {
	bannerHero: BannerHeroA;
	section_price: SectionPriceA;
	bannerBody: BannerBodyA;
	section_testimonials: SectionTestimonialsA;
	section_faq: SectionFaqA;
}

interface BannerHeroB {
	name: string;
	component: {
		marginBottom: string;
		theme: string;
		links: {
			url?: string;
			name: string;
		}[];
		bannerHero: {
			bgColor: string;
			title: string;
			description: string;
			headingTagTitle: string;
			ctaLabel: string;
			image: {
				src: string;
				alt: string;
			};
		};
	};
}

interface SectionPriceB {
	name: string;
	component: {
		title: string;
		description: string;
		price: number;
		benefits: {
			icon: string;
			text: string;
		}[];
	};
}

interface BenefitB {
	iconName: string;
	title?: string;
	caption?: string;
	details?: Record<string, unknown>;
}

interface BannerBodyB {
	name: string;
	component: {
		marginBottom: string;
		bannerBody: {
			theme: string;
			image: {
				src: string;
				alt: string;
			};
			pretitle: string;
			title: string;
			subtitle: string;
			bgColor: string;
			textColor: string;
			benefits: BenefitB[];
		};
	};
}

interface HowItWorksCard {
	title: string;
	description: string;
	variant: string;
	iconName: string;
}

interface SectionHowItWorksB {
	name: string;
	component: {
		theme: string;
		sectionTitle: string;
		cardIcons: HowItWorksCard[];
	};
}

interface CardContent {
	image: {
		src: string;
		alt: string;
	};
	title: string;
	description: string;
}

interface SectionCardContentSideBySideB {
	name: string;
	component: {
		sectionTitle: string;
		cardsContent: CardContent[];
	};
}

interface SectionServiceRequirementsB {
	name: string;
	component: {
		title: string;
		requirements: BenefitB[];
	};
}

interface TestimonialB {
	name: string;
	service: string;
	text: string;
}

interface SectionTestimonialsB {
	name: string;
	component: {
		theme: string;
		sectionTitle: string;
		cards: TestimonialB[];
	};
}

interface FaqQuestionB {
	title: string;
	description: string;
}

interface SectionFaqB {
	name: string;
	component: {
		sectionTitle: string;
		questionsAndAnswers: FaqQuestionB[];
		allBorder: string;
		allNegative: boolean;
	};
}

function formatBannerHeroDescription(text: string): string {
	const formattedText = text
		.replace(/(Recomendação:)/, '<strong>$1</strong>')
		.replace(/(Inclui:)/, '<strong>$1</strong>')
		.replace(/\n/g, '<br>');

	return `<p>${formattedText}</p>`;
}

function transformDataB(input: InputA) {
	const benefits: BenefitB[] = Object.keys(input.bannerBody)
		.filter((key) => key.startsWith('@feature') && input.bannerBody[key])
		.map((key) => {
			const feature = input.bannerBody[key];
			return {
				iconName: 'icon-porto-ic-circle-check',
				text: `<p><strong>${feature?.split(':')[0]}:</strong> ${feature?.split(':')[1]}</p>`,
			};
		});

	const testimonials: TestimonialB[] = Object.keys(input.section_testimonials)
		.filter((key) => key.startsWith('@depoimento'))
		.map((key) => {
			const index = key.split('-')[1];
			const depoimento = input.section_testimonials[key];
			const cliente = input.section_testimonials[`@cliente-${index}`];
			const data = input.section_testimonials[`@data-${index}`];

			return {
				name: cliente!,
				service:
					new Date(data).toLocaleDateString('pt-BR') === 'Invalid Date'
						? data
						: new Date(data).toLocaleDateString('pt-BR'),
				text: depoimento!,
			};
		});

	const questionsAndAnswers = Object.keys(input.section_faq)
		.filter((key) => key.startsWith('@pergunta'))
		.map((key) => {
			const index = key.split('-')[1];
			const pergunta = input.section_faq[key];
			const resposta = input.section_faq[`@resposta-${index}`];

			return {
				title: pergunta!,
				description: resposta!,
			};
		});

	return [
		{
			name: 'section_breadcrumb',
			component: {
				marginBottom: '',
				theme: 'light',
				links: [
					{ url: 'https://www.portoseguro.com.br', name: 'Home' },
					{
						url: 'https://www.portoseguro.com.br/centros-automotivos-porto-seguro',
						name: 'Centro Automotivo Porto',
					},
					{ name: input.bannerHero['@nome-do-servico'] },
				],
			},
		},
		{
			name: 'section_banner_hero',
			component: {
				theme: 'dark',
				variant: 'caps',
				marginBottom: 'margin-default',
				bannerHero: {
					bgColor: '#D9F1FF',
					title: input.bannerHero['@nome-do-servico'],
					description: formatBannerHeroDescription(input.bannerHero['@apoio']),
					headingTagTitle: 'h1',
					ctaLabel: 'Agende agora',
					subTitle: input.bannerHero['@categoria'],
					image: {
						src: removeUrlHost(input.bannerHero['@url-hero-servico']),
						alt: input.bannerHero['@nome-do-servico'],
					},
				},
			},
		},
		{
			name: 'section_card_price_with_text',
			component: {
				title: 'Sobre o serviço',
				description: input.section_price['@descricao'],
				price: Number(input.section_price['@preco'].replace(/\D/g, '')) / 100,
				benefits: [
					{
						icon: 'icon-porto-ic-credit-card',
						text: '<strong>Em até 6x</strong> no Cartão Porto Bank (parcela mínima de R$ 100)',
					},
					{
						icon: 'icon-porto-ic-discount',
						text: '<strong>Até 20% de desconto</strong> na mão de obra para segurados',
					},
				],
			},
		},
		{
			name: 'section_banner_body',
			component: {
				marginBottom: 'margin-default',
				bannerBody: {
					theme: 'light',
					image: {
						src: removeUrlHost(String(input.bannerBody['@url-body-servico'])),
						alt: 'prestador porto realizando manutenção no encanamento de uma pia',
					},
					pretitle: '',
					title: 'Por que é importante?',
					subtitle: '',
					bgColor: 'white',
					textColor: 'black75',
					benefits,
				},
			},
		},
		{
			name: 'section_how_it_works',
			component: {
				theme: 'light',
				sectionTitle: 'Como funciona?',
				cardIcons: [
					{
						title: 'Encontre uma oficina',
						description:
							'Localize a unidade do Centro Automotivo de sua preferência.',
						variant: 'withoutLink',
						iconName: 'icon-porto-ic-circle-info1',
					},
					{
						title: 'Escolha o serviço',
						description:
							'Escolha um pacote de revisão ou o serviço avulso que seu carro precisa.',
						variant: 'withoutLink',
						iconName: 'icon-porto-ic-circle-info2',
					},
					{
						title: 'Agendamento',
						description:
							'Escolha o melhor dia e horário para a realização do serviço.',
						variant: 'withoutLink',
						iconName: 'icon-porto-ic-circle-info3',
					},
					{
						title: 'Execução do serviço',
						description: 'Compareça na unidade no dia e horário agendado.',
						variant: 'withoutLink',
						iconName: 'icon-porto-ic-circle-info4',
					},
					{
						title: 'Pagamento',
						description:
							'Feito diretamente na unidade, após aprovação do diagnóstico e orçamento.',
						variant: 'withoutLink',
						iconName: 'icon-porto-ic-circle-info5',
					},
				],
			},
		},
		{
			name: 'section_card_content_side_by_side',
			component: {
				sectionTitle: 'Nossos diferenciais',
				cardsContent: [
					{
						image: {
							src: '/content/dam/vertical-servicos/centro-automotivo-porto/conteudo/cc-especialistas-centro-automotivo-porto.webp',
							alt: 'Um homen branco vestindo o uniforme da porto seguro na cor azul marinho e um boné também na cor azul marinho com o logo da porto seguro.',
						},
						title: 'Especialistas em mecânica',
						description:
							'Conte com profissionais treinados e mão de obra qualificada para cuidar do seu carro.',
					},
					{
						image: {
							src: '/content/dam/vertical-servicos/centro-automotivo-porto/conteudo/cc-garantia-centro-automotivo-porto.webp',
							alt: 'Um mulher branca de cabelos pretos, ela está vestindo uma jaquela de jeans com uma blusa de cor branca e bolinhas pretas por baixo e uma calça jeans, está deitada em um sofá de cor cinza com uma expressão de tranquilidade no rosto',
						},
						title: 'Garantia nacional Porto',
						description:
							'Garantia de até 90 dias após a realização do serviço.',
					},
					{
						image: {
							src: '/content/dam/vertical-servicos/centro-automotivo-porto/conteudo/cc-flexibilidade-centro-automotivo-porto.webp',
							alt: 'Um senhor de cabelos e barba branca sorrindo e olhando para o celular vestindo uma camisa azul com botões',
						},
						title: 'Flexibilidade',
						description:
							'Encontre a oficina mais próxima e agende serviços para seu carro no horário de sua preferência.',
					},
				],
			},
		},
		{
			name: 'section_service_requirements',
			component: {
				title: 'Informações importantes',
				variant: 'fluid',
				requirements: [
					{
						icon: 'icon-porto-ic-car-alert1',
						title: 'Diagnóstico',
						caption:
							'Todos os serviços agendados, passarão por um diagnóstico antes da execução.',
						details: {},
					},
					{
						icon: 'icon-porto-ic-circle-dollar-sign',
						title: 'Preços',
						caption:
							'Preços podem sofrer alteração de acordo com produto e/ou marca escolhidos.',
						details: {},
					},
					{
						icon: 'icon-porto-ic-motorcycle',
						title: 'Veículos não atendidos',
						caption: 'Motos, vans, pesados e veículos a diesel.',
						details: {},
					},
				],
			},
		},
		{
			name: 'section_cards_carousel_testimonial',
			component: {
				theme: 'light',
				sectionTitle: 'O que dizem nossos clientes',
				cards: testimonials,
			},
		},
		{
			name: 'section_faq',
			component: {
				sectionTitle: `Tire suas dúvidas sobre ${input.bannerHero['@nome-do-servico']}`,
				questionsAndAnswers: questionsAndAnswers,
				allBorder: 'any',
				allNegative: 'boolean',
			},
		},
	];
}

const inputFilePath = 'data.xlsx';
const outputDir = 'out';

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir);
}

const xlsxReader = new XLSXReader(inputFilePath);
const sheetsData = await xlsxReader.read();

const dataParser = new DataParser();

for (const [sheetName, rows] of Object.entries(sheetsData)) {
	const parsedData = dataParser.parseData(rows);
	const formattedSheetName = formatFileName(sheetName);
	const fileName = generateFileName(formattedSheetName, 'json');
	const filePath = path.join(outputDir, fileName);
	fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
	console.log(`Data from sheet ${sheetName} has been written to ${filePath}`);

	const convertedData = transformDataB(parsedData as unknown as InputA);
	const convertedFileName = generateFileName(
		getUrlPathName(formattedSheetName),
		'json',
	);
	const convertedFilePath = path.join('../../public/pages', convertedFileName);

	fs.writeFileSync(convertedFilePath, JSON.stringify(convertedData, null, 2));
	console.log(
		`Converted data from sheet ${sheetName} has been written to ${convertedFilePath}`,
	);
}
