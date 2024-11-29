
import sanitizeHtml from 'sanitize-html';

/**
 * Sanitiza uma string, removendo caracteres especiais e garantindo que o HTML esteja limpo.
 * @param dirtyValue A string suja a ser sanitizada.
 * @returns Uma string sanitizada, livre de caracteres especiais e HTML inseguro.
 */
export function sanitize(dirtyValue: string): string {
	// Validar entrada
	if (typeof dirtyValue !== 'string') {
		console.warn('Invalid input provided for sanitization:', dirtyValue);
		return '';
	}

	// Remover caracteres especiais não permitidos
	const valueWithoutSpecialCharacters = dirtyValue.replace(/[^a-zA-Z0-9 ]/g, '');

	// Sanitizar HTML
	const sanitizedValue = sanitizeHtml(valueWithoutSpecialCharacters);

	return sanitizedValue;
}
