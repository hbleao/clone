import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes a string by removing special characters and sanitizing HTML.
 * @param dirtyValue - The input string to sanitize.
 * @returns The sanitized string.
 */
export const sanitize = (dirtyValue: string): string => {
	if (typeof dirtyValue !== 'string') return '';

	const valueWithoutSpecialCharacter = dirtyValue.replace(/[^a-zA-Z0-9 ]/g, '');
	return sanitizeHtml(valueWithoutSpecialCharacter);
};
