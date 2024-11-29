/**
 * Formata um número para o formato de preço brasileiro (R$).
 * @param value O valor numérico a ser formatado.
 * @returns Uma string formatada como preço ou o valor original se for inválido.
 */

export function formatPrice(value: number): string | number {
	if (typeof value !== 'number' || isNaN(value)) {
		console.warn('Invalid value provided for formatting:', value);
		return value;
	}

	// Formatar o número para o formato de moeda brasileiro
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
}
