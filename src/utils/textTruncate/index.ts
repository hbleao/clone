/**
 * Truncates a string to a specified length and appends ellipses if needed.
 * @param text - The input string to truncate.
 * @param length - The maximum length of the truncated string.
 * @returns The truncated string with ellipses if it exceeds the specified length.
 */
export const textTruncate = (text: string, length: number): string => {
	if (typeof text !== 'string' || typeof length !== 'number' || length < 0)
		return '';

	if (text.length <= length) return text;
	return `${text.substring(0, length)}...`;
};
