/**
 * Removes all non-digit characters from a string.
 * @param value - The input string to process.
 * @returns A string containing only numeric characters.
 */
export const onlyNumbers = (value: string): string => {
	if (typeof value !== 'string') return '';

	return value.replace(/\D/g, '');
};
