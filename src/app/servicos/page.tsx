import { getSEOData } from '@/lib/seo';
import type { Metadata } from 'next';

import {
	AEMService,
	AllCategoriesServices,
	HighlightService,
} from '@/services';
import { DefaultTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
	const { data } = await AEMService.getContent(
		'https://www.portoseguro.com.br/cartao-de-credito.model.json',
	);

	return getSEOData({ title: data?.title });
}

export default async function Home() {
	const { sections } = await AEMService.getContent(
		'https://www.portoseguro.com.br/cartao-de-credito.model.json',
	);

	const allCategories = await AllCategoriesServices();
	const highlights = await HighlightService();

	const layout = {
		header: sections[1].component,
		footer: sections[18].component,
	};

	const mockShowcaseContent: any = [
		{
			name: 'section_breadcrumb',
			component: {
				marginBottom: '',
				theme: 'light',
				links: [
					{
						url: 'https://www.portoseguro.com.br',
						name: 'Home',
					},
					{
						url: 'https://www.portoseguro.com.br/porto-servico',
						name: 'Porto Serviço',
					},
					{
						name: 'Serviços para Casa e Auto',
					},
				],
			},
		},
		{
			name: 'section_custom_data',
			component: {
				pageName: 'Porto Serviços',
				product: 'servico-para-casa-e-auto',
				vertical: 'servicos',
				category: 'produto',
				subproduct: '-',
			},
		},
		{
			name: 'section_banner_hero',
			component: {
				theme: 'dark',
				marginBottom: 'margin-default',
				bannerHero: {
					image: {
						src: '/content/dam/vertical-servicos/conteudo/hero/bh-porto-week-casa-carro-desktop.webp',
						alt: 'campanha serviços',
					},
					title: 'Ofertas especiais para cuidar da sua casa',
					subTitle: 'PORTO SERVIÇO',
					description: 'Use o cupom PORTOWEEK30',
					bgColor: 'black100',
					headingTagTitle: 'h1',
				},
			},
		},
		{
			name: 'section_products_by_category',
			component: {
				marginBottom: 'default',
				title: 'Serviços para sua casa',
				serviceGroup: 'CASA',
				allCategories: allCategories,
			},
		},
		{
			name: 'section_products_by_category',
			component: {
				marginBottom: 'default',
				title: 'Serviços para seu carro',
				serviceGroup: 'AUTO',
				allCategories: allCategories,
			},
		},
		{
			name: 'section_products_highlight',
			component: {
				sectionTitle: 'Ofertas e novidades',
				marginBottom: 'default',
				highlights: highlights.data,
			},
		},
		{
			name: 'section_banner_body',
			component: {
				sectionTitle: '',
				position: 'right',
				marginBottom: 'margin-default',
				textColor: 'black100',
				gtmName: '',
				bannerBody: {
					theme: 'light',
					title: 'Cuidado Porto a qualquer hora',
					subtitle: 'Agendamento 24h, todos os dias da semana.',
					bgColor: 'black05',
					image: {
						src: '/content/dam/nova-home/banner-body/bb-prestador-01.webp',
						alt: 'banner',
					},
					buttons: [
						{
							label: 'Ver todos os serviços',
							styles: 'primary',
							variant: 'insurance',
							width: 'contain',
						},
					],
					benefits: [
						{
							iconName: 'icon-porto-ic-calendar',
							text: '<strong>Rápido:</strong> orçamento na hora e agendamento online',
						},
						{
							iconName: 'icon-porto-ic-clock',
							text: '<strong>Prático:</strong> pontualidade no horário agendado',
						},
						{
							iconName: 'icon-porto-ic-business-couple',
							text: '<strong>Confiável:</strong> rede própria de prestadores uniformizados e treinados',
						},
						{
							iconName: 'icon-porto-ic-medal-ribbon',
							text: '<strong>Seguro:</strong> garantia de qualidade em todos os serviços prestados.',
						},
					],
				},
				textNote: '',
			},
		},
		{
			name: 'section_faq',
			component: {
				sectionTitle: 'Tire suas dúvidas sobre a Porto Serviço',
				allBorder: 'middle',
				questionsAndAnswers: [
					{
						description:
							'<p>A Porto Serviço é a mais nova vertical de negócios do ecossistema Porto especializada em soluções que trazem conveniência para todos os momentos da vida, desde a família e o lar até a mobilidade e empresas.</p>',
						title: 'O que é a Porto Serviço?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Serviços de reparo, manutenção e instalação com a qualidade que só a Porto tem. Para quem é cliente e quem ainda não é!</p>',
						title: 'Quais serviços oferece?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>O pagamento pode ser feito, preferencialmente, pelo Cartão de Crédito Porto Bank em até 10x sem juros ou em até 4x sem juros nos cartões de crédito Visa, ou MasterCard. Consulte outras condições especiais.</p>',
						title:
							'Quais são as formas de pagamento dos Serviços para Casa e Auto?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Não. Os Serviços para Casa e Auto são destinados para atender todas as pessoas.</p>',
						title:
							'É preciso ser cliente Porto Seguro para comprar Serviços para Casa e Auto?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Sim. Cliente Cartão de Crédito Porto Bank tem 20% de desconto e pode parcelar as compras em até 10x sem juros.</p>',
						title:
							'Cliente Cartão de Crédito Porto Bank tem vantagem ao contratar Serviços para Casa e Auto?',
						headingTag: 'h3',
					},
					{
						description:
							'<li>Profissionais uniformizados e treinados;</li><li>Agendamento 24h;<li>Segurança de ter um profissional Porto Seguro na sua casa;</li><li>Senha para confirmar a visita da pessoa prestadora de serviço;</li><li>Central de Atendimento Online 24h;</li><li>Cancelamento e reagendamento grátis;</li><li>Serviço com garantia de mão de obra até 90 dias.</li>',
						title:
							'Quais as vantagens em contratar os Serviços para Casa e Auto?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Sim, mas apenas pela loja online é possível realizar a contratação de um serviço por compra. Para comprar 2 ou mais serviços, fale com a nossa central de atendimento pelo chat online</p>',
						title: 'Posso contratar mais de um serviço?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Nesse caso, você deve entrar em contato com seu corretor de seguros e ele vai indicar o melhor caminho para contratação.</p>',
						title:
							'Tenho serviço na minha apólice de seguro. Como faço para contratá-lo?',
						headingTag: 'h3',
					},
					{
						description:
							"<p>Para reagendar um serviço, entre em contato com a nossa central de atendimento pelo <a href='https://www.portoseguro.com.br/fale-conosco/contatos/chat'>chat.</a></p>",
						title: 'Como reagendar um serviço?',
						headingTag: 'h3',
					},
				],
			},
		},
		{
			name: 'section_card_content',
			component: {
				sectionTitle: 'Atendimento Porto Serviço',
				cardsContent: [
					{
						title: 'Chat',
						description: 'Atendimento de segunda a sexta, das 8h às 20h.',
						button: {
							label: 'Falar com o Chat',
							link: 'https://prime.altubots.com/chats/portoassistencia/e67490dac9a657589b41411700ce378c/index.html',
							target: 'blank',
							variant: 'insurance',
							styles: 'secondary',
							width: 'fluid',
						},
					},
					{
						title: 'Autoatendimento',
						description:
							'Você mesmo cancela, reagenda ou solicita retorno dos serviços.',
						button: {
							label: 'Acessar autosserviço',
							link: 'https://autosservico.portosegurofaz.com.br/',
							target: 'blank',
							variant: 'insurance',
							styles: 'secondary',
							width: 'fluid',
						},
					},
					{
						title: 'Assinantes Reppara!',
						description:
							'Informações do seu plano, serviços inclusos, endereço atendido e mais.',
						button: {
							label: 'Entrar',
							link: 'https://app.reppara.com.br/',
							target: 'blank',
							variant: 'insurance',
							styles: 'secondary',
							width: 'fluid',
						},
					},
				],
			},
		},
		{
			name: 'section_banner_body',
			component: {
				sectionTitle: '',
				position: 'right',
				textColor: 'white',
				marginBottom: 'margin-default',
				gtmName: '',
				bannerBody: {
					theme: 'dark',
					image: {
						src: '/content/dam/vertical-servicos/conteudo/bb-cartao-porto-bank.webp',
						alt: 'Imagem do cartão azul da Porto Bank',
					},
					title: 'Serviços com 20% de desconto no Cartão Porto Bank',
					bgColor: 'portoBanking100',
					benefits: [
						{
							text: 'Pagando com nosso cartão de crédito, você tem 20% OFF na contratação de qualquer serviço. E ainda pode parcelar em até 10x sem juros!',
						},
					],
					buttons: [
						{
							label: 'Peça o seu cartão',
							link: 'https://www.portoseguro.com.br/cartao-de-credito',
							target: '_blank',
							variant: 'negative',
							styles: 'primary',
							width: 'contain',
						},
					],
				},
				textNote: '',
			},
		},
		{
			name: 'section_card_content_side_by_side',
			component: {
				sectionTitle: 'Você também pode gostar destas soluções Porto',
				cardsContent: [
					{
						image: {
							src: '/content/dam/produtos/residencia/cc_seguro_celular.webp',
							alt: 'alternative text',
						},
						title: 'Seguro Celular',
						link: 'https://www.portoseguro.com.br/celular',
					},
					{
						image: {
							src: '/content/dam/produtos/residencia/cc_seguro_vida.webp',
							alt: 'alternative text',
						},
						title: 'Seguro de Vida',
						link: 'https://www.portoseguro.com.br/seguro-de-vida',
					},
					{
						image: {
							src: '/content/dam/produtos/residencia/cc_auto.webp',
							alt: 'alternative text',
						},
						title: 'Seguro Auto',
						link: 'https://www.portoseguro.com.br/seguro-auto',
					},
					{
						image: {
							src: '/content/dam/produtos/residencia/cc_previdencia_privada.webp',
							alt: 'alternative text',
						},
						title: 'Seguro Viagem',
						link: 'https://www.portoseguro.com.br/seguro-viagem',
					},
				],
			},
		},
	];

	return (
		<DefaultTemplate
			className="template-vitrine"
			sections={mockShowcaseContent}
			layout={layout}
		/>
	);
}
