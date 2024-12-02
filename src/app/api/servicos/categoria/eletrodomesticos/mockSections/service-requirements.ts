export const sectionServiceRequirements = {
	name: 'section_service_requirements',
	component: {
		title: 'Requisitos para este serviço',
		requirements: [
			{
				icon: 'icon-porto-wash-machine',
				title: 'Produtos',
				caption: 'Saiba mais',
				details: {
					content: `
            <p>
             O cliente deve <strong> verificar se o produto está dentro do prazo de garantia do fabricante ou da assistência técnica </strong>, sob risco de perda da garantia caso execute o serviço com terceiros.
						 </p>
						 <p>
Caso o produto tenha sido recém-transportado, é necessário <strong>aguardar o período de 2 horas antes de ligá-lo à rede elétrica </strong>, para normalização do sistema interno (óleo e gás).
</p>
<p>
Não nos responsabilizamos pela perda de qualquer item armazenado.
Para freezer expositor, não fazemos reparo em qualquer componente que compõe o sistema de fechamento da tampa de vidro ou similar.
</p>

          `,
				},
			},
			{
				icon: 'icon-porto-gear',
				title: 'Peças',
				caption: 'Saiba mais',
				details: {
					content: `
           <p> Produtos nacionais e importados só poderão ser consertados <strong>se houver peças de reposição no mercado. </strong></p>
					 <p>
A compra de peças e dispositivos para a realização do serviço <strong>será de responsabilidade do cliente, sob orientação do prestador. </strong>
</p>
<p>
Também é<strong> indicada a utilização de peças originais </strong> para ter qualidade, durabilidade e garantia do serviço.
</p>
          `,
				},
			},
			{
				icon: 'icon-porto-residence',
				title: 'Espaço de trabalho',
				caption: 'Saiba mais',
				details: {
					content: `<p>Cabe ao cliente ter um espaço mínimo necessário <strong>para movimentação do equipamento na execução do serviço.</strong> </p>
					<p>
	É importante que o produto esteja disponível para a manutenção, bem como os <strong>pontos elétrico e/ou hidráulico compatíveis com o produto. </strong>
	</p>
	<p>
	Verifique a <strong>disponibilidade das conexões hidráulicas </strong>(fornecimento e saída de água).</p>`,
					notification: {
						icon: 'icon-porto-home-alert',
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
           É necessário um responsável <strong>maior de 18 anos no local para acompanhamento.</strong> Caso contrário, o serviço não será realizado e haverá taxa de visita do prestador, no valor de R$ 120.
          `,
				},
			},
		],
	},
};
