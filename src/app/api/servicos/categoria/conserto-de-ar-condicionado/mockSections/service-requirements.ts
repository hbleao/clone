export const sectionServiceRequirements = {
	name: 'section_service_requirements',
	component: {
		title: 'Requisitos para este serviço',
		requirements: [
			{
				icon: 'icon-porto-ic-upload',
				title: 'Altura do equipamento',
				caption: 'Saiba mais',
				details: {
					content: `
						<p>O ar-condicionado deve estar em uma <strong>altura de até 3 m em ambientes internos e 6 m em ambientes externos.</strong></p>
						<p>O aparelho interno (evaporadora) precisa estar em uma <strong>distância mínima de 20 cm do teto para acesso aos componentes.</strong></p>
          `,
				},
			},
			{
				icon: 'icon-porto-residence',
				title: 'Espaço de trabalho',
				caption: 'Saiba mais',
				details: {
					content: `
						<p>
								Cabe ao cliente ter um espaço mínimo necessário para movimentação do equipamento na execução do serviço.

								Se houver móveis ou objetos abaixo do ar-condicionado, deverão ser retirados do local. É necessário que haja espaço livre embaixo do equipamento, para que nosso prestador possa realizar o serviço.
						</p>
          `,
					notification: {
						icon: 'icon-porto-ic-residence-alert',
						title: 'Se você mora em condomínio',
						description:
							'Os serviços serão realizados somente no imóvel do cliente que contratou, respeitando as leis de silêncio e as regras de acesso aos prestadores.',
					},
				},
			},
			{
				icon: 'icon-porto-ic-gear',
				title: 'Peças	',
				caption: 'Saiba mais',
				details: {
					content: `
						<p>Produtos nacionais e importados só poderão ser consertados <strong>se houver peças de reposição no mercado.</strong></p>
						<p>A compra de peças e dispositivos para a realização do serviço <strong>será de responsabilidade do cliente</strong>, sob orientação do prestador.</p>
						<p>Também <strong>é indicada a utilização de peças originais pra ter qualidade</strong>, durabilidade e garantia do serviço.</p>

						<p>O prestador está <strong>autorizado a realizar locomoções apenas no mesmo ambiente (cômodo)</strong> onde o serviço foi solicitado.</p>
          `,
				},
			},
			{
				icon: 'icon-porto-user',
				title: 'Maior responsável',
				caption: 'Saiba mais',
				details: {
					content: `
						<p>É necessário um <strong>responsável maior de 18 anos</strong> no local para acompanhamento. Caso contrário, o serviço <strong>não será realizado</strong> e haverá <strong>taxa de visita do prestador, no valor de R$ 120</strong>.</p>
          `,
				},
			},
		],
	},
};
