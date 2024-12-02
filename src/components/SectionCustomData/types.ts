export type CustomDataProps = {
	pageName: string;
	product: string;
	vertical: 'servicos' | 'bank' | 'saude' | 'holding' | 'seguro';
	subproduct: string;
	funnel?: string;
	category:
		| 'produto'
		| 'institucional'
		| 'aquicisao'
		| 'area-do-cliente'
		| 'checkout'
		| 'autenticacao'
		| 'atendimento'
		| 'sinistro';
};
