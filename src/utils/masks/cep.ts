/**
 * Aplica a máscara de CEP (XXXXX-XXX) a uma string fornecida.
 * @param value Uma string representando um CEP com ou sem caracteres não numéricos.
 * @returns Uma string formatada no padrão de CEP `XXXXX-XXX`.
 */

export function applyCepMask(value: string): string {
	// Remover caracteres não numéricos
	const numericValue = value.replace(/\D/g, '').slice(0, 8);

	// Aplicar a máscara de CEP
	return numericValue.replace(/^(\d{5})(\d)/, '$1-$2');
}
