export const sectionServiceRequirements = {
	name: 'section_service_requirements',
	component: {
		title: 'Requisitos para este serviço',
		requirements: [
			{
				icon: 'icon-porto-tap',
				title: 'Peças e dispositivos',
				caption: 'Saiba mais',
				details: {
					content: `
            <p>
          A compra de peças e dispositivos para a realização do serviço <strong> será de responsabilidade do cliente </strong>, sob orientação do prestador.
            </p>
<p>Caso precise de novas peças para a conclusão do serviço, não se preocupe,<strong> você terá 20 dias corridos para que o técnico retorne a sua casa </strong>sem custo adicional.</p>
          `,
				},
			},
			{
				icon: 'icon-porto-pipe',
				title: 'Tubulação',
				caption: 'Saiba mais',
				details: {
					content: `
					<p>Consertos e instalações em tubulações e conexões de PVC (água fria) e CPVC (água quente).</p>
<p><strong>Exceções:</strong></p>
<ul>
<li>Consertos e instalações em tubulações de manilhas (cerâmicas, ferro, cobre);</li>
<li>Reparos em tubulações de aquecedores de água elétricos, a gás e ou solares;</li>
<li>Reparos em tubulação de piscinas, banheira de hidromassagem ou similar;</li>
<li>Vazamentos em tubulações de gás;</li>
<li>Reparos em prumadas (colunas de edifícios) de águas frias, quentes, pluviais ou de esgotos;</li>
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
           <p>Cabe ao cliente ter um espaço mínimo necessário <strong>para movimentação do equipamento</strong> na execução do serviço.</p>
<p>É importante que o produto esteja disponível para a manutenção, bem como os <strong>pontos elétrico e/ou hidráulico compatíveis com o produto.</strong></p>
<p>Verifique a <strong>disponibilidade das conexões hidráulicas</strong> (fornecimento e saída de água).</p>
          `,
					notification: {
						icon: 'icon-porto-residence-alert',
						title: 'Se você mora em condomínio',
						description:
							'Os serviços serão realizados somente no imóvel do cliente que contratou, respeitando as leis de silêncio e as regras de acesso aos prestadores.',
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
