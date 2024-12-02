export const sectionServiceRequirements = {
	name: 'section_service_requirements',
	component: {
		title: 'Requisitos para este serviço',
		requirements: [
			{
				icon: 'icon-porto-pipe',
				title: 'Tubulação',
				caption: 'Saiba mais',
				details: {
					content: `
							<p>O serviço de desentupimento é exclusivo para <strong>tubulações de PVC.</strong></p>
							<p><strong>Atenção! Não atendemos:</strong></p>
							<ul>
								<li>Desentupimento de tubulações de água potável (água limpa);</li>
								<li>Desentupimento de tubulações de cerâmica (manilhas) ou de ferro;</li>
								<li>Desentupimento ou desobstrução de tubulações deterioradas ou corroídas;</li>
								<li>Desentupimento ou desobstrução de tubulações por acúmulo de detritos, argamassa, areia e raízes;</li>
								<li>Desentupimentos em prumadas (colunas) de edifícios.</li>
							</ul>
          `,
				},
			},
			{
				icon: 'icon-porto-grease-trap',
				title: 'Caixa de inspeção e gordura',
				caption: 'Saiba mais',
				details: {
					content: `
						<p>As caixas de inspeção e de gordura <strong>devem estar demarcadas e serem indicadas</strong> pelo cliente ou responsável. A distância entre as caixas <strong>não deve ser superior a 12 metros.</strong></p>
          `,
				},
			},
			{
				icon: 'icon-porto-residence',
				title: 'Local de serviço',
				caption: 'Saiba mais',
				details: {
					content: `
						<p>O desentupimento ficará limitado exclusivamente às <strong>tubulações, caixas e louças sanitárias pertencentes à área do imóvel informado pelo cliente</strong>, mesmo que existam trechos interligados a imóveis vizinhos.</p>
						<p>O prestador está <strong>autorizado a realizar locomoções apenas no mesmo ambiente (cômodo)</strong> onde o serviço foi solicitado.</p>
          `,
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
						<p>É necessário um <strong>responsável maior de 18 anos</strong> no local para acompanhamento. Caso contrário, o serviço <strong>não será realizado</strong> e haverá <strong>taxa de visita do prestador, no valor de R$ 120</strong>.</p>
          `,
				},
			},
		],
	},
};
