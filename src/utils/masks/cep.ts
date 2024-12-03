/**
 * Applies a Brazilian postal code (CEP) mask to a string.
 * @param value - The input string to format.
 * @returns The formatted CEP string in the format XXXXX-XXX.
 */
export const cepMask = (value: string): string => {
	if (typeof value !== 'string') return '';

	let numericValue = value.replace(/\D/g, '');

	if (numericValue.length > 8) {
		numericValue = numericValue.substring(0, 8);
	}

	return numericValue.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};
