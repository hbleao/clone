export const sectionTermsOfUse = {
	name: 'section_terms_of_use',
	component: {
		title: 'Termos de uso e condições',
		text: 'Consulte os termos de uso e condições deste serviço.',
		button: {
			label: 'Consultar',
		},
		modal: {
			title: 'Termos de uso e condições',
			content: [
				{
					title: 'Condições',
					description: `
						<div class="section-terms-of-use__box-pdf">
							<p class="section-terms-of-use__title-pdf">Conserto de ar-condicionado</p>
							<p section-terms-of-use__text-pdf>a partir de 18/12/2023</p>
							<a class="section-terms-of-use__anchor-pdf" href="https://www.portoseguro.com.br/content/dam/documentos/condicoes_gerais/porto_servico/2023/2023-ce-conserto-ar-condicionado-18-12-2023.pdf" target="blank">DOWNLOAD</a>
						</div>
						<div class="section-terms-of-use__box-pdf">
							<p class="section-terms-of-use__title-pdf">Porto Serviço</p>
							<p section-terms-of-use__text-pdf>Vigência: a partir de 19/08/2024</p>
							<a class="section-terms-of-use__anchor-pdf" href="https://www.portoseguro.com.br/content/dam/documentos/condicoes_gerais/porto_servico/2024/2024_ce_porto_servico_19-08-2024.pdf" target="blank">DOWNLOAD</a>
						</div>
					`,
				},
				{
					title: 'Termos de uso',
					description:
						'<a class="section-terms-of-use__anchor-pdf" href="https://www.portoseguro.com.br/content/dam/documentos/condicoes_gerais/porto_servico/2024/2024_termos_de_uso_porto_servico.pdf" download="termos-de-uso.pdf" target="blank">DOWNLOAD</a>',
				},
			],
		},
	},
};
