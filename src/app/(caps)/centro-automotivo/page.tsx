import { AEMService, CapsServicesService } from '@/services';
import { DefaultTemplate } from '@/templates';

export default async function CapsHome() {
	const { sections } = await AEMService.getContent(
		'https://www.portoseguro.com.br/cartao-de-credito.model.json',
	);

	const layout = {
		header: sections[1].component,
		footer: sections[18].component,
	};

	const httpServicesResponse = await CapsServicesService();

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
						name: 'Centro Automotivo Porto',
					},
				],
			},
		},
		{
			name: 'section_custom_data',
			component: {
				pageName: 'Porto Serviços',
				product: 'centro-automotivo-porto',
				subproduct: '-',
				category: 'aquisicao',
				vertical: 'servicos',
			},
		},
		{
			name: 'section_banner_hero',
			component: {
				theme: 'dark',
				marginBottom: 'margin-default',
				position: 'left',
				bannerHero: {
					image: {
						src: '/content/dam/vertical-servicos/centro-automotivo-porto/conteudo/bh-centro-automotivo-porto-desktop.webp',
						alt: 'campanha serviços',
					},
					subTitle: 'Centro Automotivo Porto',
					title: 'Oficinas para quem gosta de cuidar do carro',
					description:
						'Serviços feitos para você, que já é nosso cliente ou não, com agendamento rápido e fácil e valores a partir de R$ 80.',
					bgColor: 'portoSeguros100',
					headingTagTitle: 'h1',
					button: {
						label: 'Confira nossos serviços',
						variant: 'negative',
						link: '/centro-automotivo?#escolha-o-que-seu-carro-precisa',
					},
				},
			},
		},
		{
			name: 'section_products_highlight',
			component: {
				sectionTitle: 'Escolha o que seu carro precisa',
				marginBottom: 'default',
				highlights: httpServicesResponse.data,
			},
		},
		{
			name: 'section_how_it_works',
			component: {
				theme: 'light',
				sectionTitle: 'Descontos exclusivos na mão de obra',
				sectionDescription:
					'Para clientes Seguro Auto e aplicados diretamente na oficina.',
				cardIcons: [
					{
						title: '20% Seguro Auto da Porto',
						description: '',
						variant: 'withoutLink',
						customIcon: 'icon-logo-porto',
					},
					{
						title: '15% Itaú Seguro Auto',
						description: '',
						variant: 'withoutLink',
						customIcon: 'icon-logo-itau',
					},
					{
						title: '15% Seguro Auto da Mitsui Sumitomo',
						description: '',
						variant: 'withoutLink',
						customIcon: 'icon-logo-msig',
					},
					{
						title: '15% Azul Seguro Auto',
						description: '',
						variant: 'withoutLink',
						customIcon: 'icon-logo-azul-seguro-auto',
					},
				],
			},
		},
		{
			name: 'section_banner_body',
			component: {
				sectionTitle: '',
				position: 'right',
				textColor: 'black100',
				marginBottom: 'margin-default',
				gtmName: '',
				bannerBody: {
					theme: 'light',
					image: {
						src: '/content/dam/vertical-servicos/centro-automotivo-porto/conteudo/bb-pneustore.webp',
						alt: 'Imagem do pneu store',
					},
					title:
						'Compre seu pneu com desconto no site, receba e monte em nossas oficinas',
					bgColor: 'white',
					benefits: [
						{
							text: 'Usando o cupom PORTO você ganha desconto na compra e montagem dos novos pneus do seu carro.',
						},
					],
					buttons: [
						{
							label: 'Utilize o cupom PORTO',
							link: 'https://www.pneustore.com.br/',
							target: '_blank',
							variant: 'insurance',
							styles: 'primary',
							width: 'contain',
						},
					],
					textNote: '',
				},
			},
		},
		{
			name: 'section_banner_body',
			component: {
				sectionTitle: '',
				position: 'left',
				textColor: 'white',
				marginBottom: 'margin-default',
				gtmName: '',
				bannerBody: {
					theme: 'dark',
					image: {
						src: '/content/dam/vertical-servicos/conteudo/bb-cartao-porto-bank.webp',
						alt: 'Imagem do cartão azul da Porto Bank',
					},
					pretitle: 'CARTÃO PORTO BANK',
					title: 'Vantagens no pagamento dos seus serviços',
					bgColor: 'portoBanking100',
					benefits: [
						{
							text: 'Parcelamento em até 6x sem juros (parcela mínima de R$ 100)',
							iconName: 'icon-porto-ic-circle-dollar',
						},
						{
							text: 'Primeira anuidade grátis',
							iconName: 'icon-porto-ic-card-credit',
						},
						{
							text: 'Desconto em combustível Shell Box e Tag Porto Bank grátis sem mensalidade',
							iconName: 'icon-porto-ic-gaspump',
						},
					],
					buttons: [
						{
							label: 'Solicite o seu cartão no Centro Automotivo Porto',
							link: 'https://www.portoseguro.com.br/cartao-de-credito',
							target: '_blank',
							variant: 'negative',
							styles: 'ghost',
							width: 'contain',
						},
					],
					textNote: 'Aprovação sujeita à análise de crédito',
				},
			},
		},
		{
			name: 'section_text_body',
			component: {
				title: 'Atendimento Centro Automotivo Porto',
				text: 'Dúvidas, informações, cancelamento ou reagendamento, fale pelo e-mail: falecom.centroautomotivo@portoseguro.com.br',
				link: {
					label: 'Envie e-mail',
					href: 'mailto:falecom.centroautomotivo@portoseguro.com.br',
					variant: 'insurance',
					styles: 'secondary',
				},
			},
		},
		{
			name: 'section_faq',
			component: {
				sectionTitle: 'Tire suas dúvidas sobre Centro Automotivo Porto',
				allBorder: 'middle',
				questionsAndAnswers: [
					{
						description:
							'<p>Clientes e segurados da Porto podem ir às oficinas e contam com condições especiais e alguns benefícios. Público em geral também pode contar com os serviços especializados e mão de obras dos Centro Automotivos Porto.</p>',
						title: 'Quem pode usar os serviços do Centro Automotivo Porto?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Segurados Auto Porto Seguro contam com desconto de 20% na mão de obra. Segurados Itaú Auto, Mitsui e Azul Auto contam com 15% de desconto na mão de obra em serviços.</p>',
						title: 'Cliente do Seguro Auto tem alguma vantagem?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Segurados Auto da Porto Seguros contam com benefícios gratuitos*;</p> <ul><li>Cristalização de para-brisas e do vigia traseiro;</li><li>Regulagem do foco dos faróis;</li><li>Troca de lâmpadas externas (exceto para lâmpadas xenon, leds e similares);</li><li>Reparo de furo em pneu</li><li>Diagnóstico gratuito em mais de 20 itens do veículo.</li><p>* Consulte localidades. Serviços gratuitos vinculados ao tipo de cobertura, região de contratação e modelo de veículo.</p></ul><p>Verifique em sua apólice quais serviços o veículo segurado tem direito.</p><p>Clientes Cartão de Crédito da Porto Seguro Bank podem parcelar seus serviços em até 6X sem juros (Parcela mínima no valor de R$ 100) e trocar seus pontos na Porto Plus ou ganhar desconto na renovação do seguro Auto da Porto.</p><p>Para o público em geral o Centro Automotivo Porto oferece o "diagnóstico em mais de 20 itens do veículo gratuitamente".</p>',
						title: 'Os benefícios são para todos ou apenas para clientes?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Diversos serviços para manutenção preventiva e reparos de veículos, como diagnósticos, revisão, alinhamento, balanceamento, troca de óleo, revisão de freio, bateria veicular, limpeza de ar-condicionado, entre muitos outros serviços que podem ser utilizados por clientes Porto e não clientes.</p>',
						title: 'Quais serviços são oferecidos no Centro Automotivo Porto?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Oficinas referenciadas não são Centros Automotivos da Porto, são oficinas credenciadas pela Porto para serem utilizadas em momento de sinistro, por exemplo, uma vez que os Centros Automotivos Porto não fazem reparos estéticos.</p>',
						title:
							'As oficinas referenciadas fazem parte do Centro Automotivo Porto?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>Segurado Auto da Porto Seguro ganha um alinhamento de direção.</p><p>Os segurados podem acessar a <strong>Área de Cliente</strong> no site Porto, no mês de seu aniversário de nascimento, e consultar se há disponibilidade de fazer um alinhamento gratuito em seu veículo segurado. Caso deseje, o segurado pode ligar na unidade mais próxima e agendar o benefícios de aniversário.</p><p>Veja como é fácil agendar o benefício de forma online:</p><ol><li>Após fazer o login na Área do Cliente, disponível aqui no site, clique em <strong>"Todos os meus serviços"</strong>, do produto automóvel;</li><li>Em seguida, clique em <strong>"Serviços para seu veículo"</strong>;</li><li>Depois, em <strong>"Benefícios - Centro Automotivo"</strong>;</li><li>E, por fim, em <strong>"Solicitar Alinhamento Auto Porto”</strong>.</li></ol>',
						title:
							'Os segurados do Seguro Auto da Porto têm benefícios no mês de seu aniversário?',
						headingTag: 'h3',
					},
					{
						description:
							'<p>O Corretor da Porto conta com o presente de “Alinhamento de direção gratuito” no mês do aniversário.</p><p><strong>Regras:</strong> apresente sua Susep e uma identidade com foto e data de nascimento.</p><p>Presente válido para apenas um veículo, o veículo deve estar em nome do Corretor.</p>',
						title:
							'Corretor da Porto tem algum benefício no Centro Automotivo da Porto?',
						headingTag: 'h3',
					},
				],
			},
		},
	];

	return (
		<DefaultTemplate
			className="template-centro-automotivo"
			sections={mockShowcaseContent}
			layout={layout}
		/>
	);
}
