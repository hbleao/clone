export const formattedPrice = (value: number) => {
	if (!value) return value;

	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};
