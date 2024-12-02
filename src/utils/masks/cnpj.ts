/**
 * Aplica a máscara de CNPJ a um valor fornecido.
 * @param value Uma string representando um CNPJ, com ou sem caracteres não numéricos.
 * @returns Uma string formatada no padrão de CNPJ `XX.XXX.XXX/XXXX-XX`.
 */

export function applyCnpjMask(value: string): string {
	// Limpar caracteres não numéricos
	const cleanCnpj = value.replace(/\D+/g, '');

	// Aplicar a máscara ao CNPJ
	return cleanCnpj
		.replace(/(\d{2})(\d)/, '$1.$2') // Primeiro ponto
		.replace(/(\d{3})(\d)/, '$1.$2') // Segundo ponto
		.replace(/(\d{3})(\d)/, '$1/$2') // Barra
		.replace(/(\d{4})(\d)/, '$1-$2') // Traço
		.replace(/(-\d{2})\d+?$/, '$1'); // Limitar a 14 dígitos no total
}
