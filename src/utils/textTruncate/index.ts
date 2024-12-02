/**
 * Trunca um texto para o comprimento especificado e adiciona "..." ao final, se necessário.
 * @param text O texto a ser truncado.
 * @param length O comprimento máximo permitido antes de truncar.
 * @returns O texto truncado ou `undefined` se o texto não for fornecido.
 */
export function truncateText(text: string, length: number): string | undefined {
	// Validar entrada
	if (!text) {
		console.warn('No text provided for truncation.');
		return undefined;
	}

	// Retornar o texto original se não exceder o comprimento permitido
	if (text.length <= length) {
		return text;
	}

	// Truncar o texto e adicionar "..."
	return `${text.substring(0, length)}...`;
}
