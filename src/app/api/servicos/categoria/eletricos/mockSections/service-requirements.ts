export const sectionServiceRequirements = {
	name: 'section_service_requirements',
	component: {
		title: 'Requisitos para este serviço',
		requirements: [
			{
				icon: 'icon-porto-lamp',
				title: 'Peças e dispositivos',
				caption: 'Saiba mais',
				details: {
					content: `
            <p>
          A compra de peças e dispositivos para a realização do serviço <strong> será de responsabilidade do cliente </strong>, sob orientação do prestador.
            </p>
            <p>
              Certifique-se que o item a ser instalado ou substituído <strong> seja compatível com a rede elétrica </strong> do imóvel.
            </p>
            <p>
              Caso precise de novas peças para a conclusão do serviço, não se preocupe, <strong> você terá 20 dias corridos para que o técnico retorne a sua casa </strong> sem custo adicional.
            </p>
          `,
				},
			},
			{
				icon: 'icon-porto-wiring',
				title: 'Fiação',
				caption: 'Saiba mais',
				details: {
					content: `
            <p>
              Os fios, cabos e demais dispositivos (como quadros, tomadas, interruptores, chuveiros, torneiras elétricas) do sistema elétrico devem ser compatíveis entre si para o sistema funcionar com segurança.
            </p>
            <p>
              <strong>Fios e cabos devem ter a bitola (espessura) mínima </strong> exigida pelo dispositivo em que estarão conectados. Uma bitola inferior pode sobrecarregar o sistema elétrico, gerando aquecimento e, consequentemente, um incêndio. Seguem medidas recomendadas:
            </p>
            <ul>
              <li>Para tomadas de uso geral: mínimo de 2,5 mm²; </li>
              <li>Para fios de chuveiros: mínimo de 4 mm²; </li>
              <li>Para aparelhos mais potentes, como ar-condicionado: cerca de 6 mm². </li>
            </ul>
          `,
				},
			},
			{
				icon: 'icon-porto-residence',
				title: 'Espaço de trabalho',
				caption: 'Saiba mais',
				details: {
					content: `
            <p> Cabe ao cliente ter um espaço mínimo necessário <strong> para movimentação do equipamento </strong> na execução do serviço.</p>

            <p>O prestador está <strong>autorizado a realizar locomoções apenas no mesmo ambiente </strong> (cômodo) onde o serviço foi solicitado.</p>
          `,
					notification: {
						icon: 'icon-porto-home-alert',
						title: 'Condomínios',
						description:
							'Os serviços serão realizados somente no imóvel do(a) cliente que contratou, respeitando as leis de silêncio e as regras de acesso ao condomínio. Confira os horários permitidos!',
					},
				},
			},
			{
				icon: 'icon-porto-user',
				title: 'Maior responsável',
				caption: 'Saiba mais',
				details: {
					content: `
            <p> É necessário um responsável <strong> maior de 18 anos no local para acompanhamento </strong>. Caso contrário, o serviço não será realizado e haverá taxa de visita do prestador, no valor de R$ 120.</p>
          `,
				},
			},
		],
	},
};
