/**
 * Applies a Brazilian CNPJ mask to a string.
 * @param value - The input string to format.
 * @returns The formatted CNPJ string in the format XX.XXX.XXX/XXXX-XX.
 */
export const cnpjMask = (value: string): string => {
	if (typeof value !== 'string') return '';

	return value
		.replace(/\D+/g, '')
		.replace(/(\d{2})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1/$2')
		.replace(/(\d{4})(\d{2})$/, '$1-$2');
};
