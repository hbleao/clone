export const cpfMask = (e: string): string => {
	const cpfNumbers = e.slice(0, 14);
	return cpfNumbers
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1-$2');
};
