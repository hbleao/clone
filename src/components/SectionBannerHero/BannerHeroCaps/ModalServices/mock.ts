export type TServicesMock = {
	title?: string;
	services: {
		label: string;
		description?: string;
		type?: 'multiple' | 'only';
		node?: Record<string, unknown>;
	}[];
};

export const mock: TServicesMock = {
	title: 'Que tal aproveitar a visita e avaliar outros itens?',
	services: [
		{
			label: 'Alinhamento e balanceamento',
			description:
				'Verificação e ajuste do alinhamento das rodas, balanceamento dos pneus.',
		},
		{
			label: 'Amortecedores e suspensão',
			description: 'Identificação de vazamentos, desgaste, folgas e ruídos.',
		},
		{
			label: 'Ar condicionado e filtro',
			description:
				'Verificação das saídas e dutos de ar, aplicação de produto para limpeza do sistema e troca do filtro de cabine.',
		},
		{
			label: 'Bateria',
			description:
				'Teste de carga, vida útil, limpeza dos polos e troca da bateria quando necessário.',
		},
		{
			label: 'Cristalização de para-brisa',
			description:
				'Aplicação de produto que cria uma camada protetora, repelindo água, sujeira e óleo para melhor visibilidade.',
		},
		{
			label: 'Direção',
			description: 'Identificação de vazamentos e folgas.',
		},
		{
			label: 'Filtro de ar do motor',
			description:
				'Evita que impurezas cheguem ao motor, protegendo componentes como pistões, cilindros, anéis, válvulas e mancais.',
		},
		{
			label: 'Fluido de freio',
			description: 'Checagem visual do nível e qualidade do fluido.',
		},
		{
			label: 'Palheta de para-brisas',
			description: 'Troca das lâminas por desgaste de uso.',
		},
		{
			label: 'Pastilhas e discos de freio',
			description: 'Verificação do desgaste e substituição quando necessário.',
		},
		{
			label: 'Rodízio de pneus',
			description:
				'Fundamental para evitar o desgaste precoce ou irregular do pneu.',
		},
		{
			label: 'Sistema de iluminação',
			description:
				'Checagem de faróis, alinhamento, lanternas e luzes internas.',
		},
		{
			label: 'Transmissão',
			description:
				'Verificação de dificuldade para engatar marchas ou ruídos estranhos.',
		},
		{
			label: 'Troca de óleo',
			description: 'Substituição do óleo, filtro de óleo e anel de vedação.',
		},
		{
			label: 'Outros',
			node: {
				component: 'textarea',
				placeholder: 'Descreva sua necessidade',
			},
		},
		{
			label: 'Não preciso de outros serviços',
			description:
				'Selecione esta opção se não quiser adicionar serviços adicionais.',
			type: 'only',
		},
	],
};
