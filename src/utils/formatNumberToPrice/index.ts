/**
 * Formats a number as a currency string in Brazilian Real (BRL).
 * @param value - The number to format.
 * @returns The formatted currency string or 'Invalid number' if input is not a valid number.
 */
export const formattedPrice = (value: number): string => {
	if (value) return 'Invalid number';

	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};
