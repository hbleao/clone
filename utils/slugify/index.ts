
/**
 * Converte uma string em um slug válido para URLs.
 * @param text O texto a ser convertido.
 * @returns O slug gerado como uma string.
 */
export function slugify(text: string): string {
	if (!text) {
		console.warn('No text provided for slugify.');
		return '';
	}

	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // Substitui espaços por hífens
		.replace(/[^\w-]+/g, '') // Remove caracteres inválidos
		.replace(/--+/g, '-') // Substitui múltiplos hífens consecutivos por um único hífen
		.replace(/^-+/, '') // Remove hífens do início
		.replace(/-+$/, ''); // Remove hífens do final
}
