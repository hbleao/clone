/**
 * Remove todos os caracteres não numéricos de uma string.
 * @param input A string que será processada.
 * @returns Uma string contendo apenas números.
 */
export function extractNumbers(input: string): string {
	// Validar entrada
	if (typeof input !== 'string') {
		console.warn('Invalid input provided. Expected a string:', input);
		return '';
	}

	// Remover caracteres não numéricos
	return input.replace(/\D/g, '');
}
