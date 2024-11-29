/**
 * Aplica a máscara de CPF ao valor fornecido.
 * @param value A string contendo números ou caracteres mistos representando um CPF.
 * @returns Uma string formatada no padrão de CPF `XXX.XXX.XXX-XX`.
 */
export function applyCpfMask(value: string): string {
	// Limitar o tamanho da string ao máximo de 14 caracteres e remover caracteres não numéricos
	const cleanCpf = value.replace(/\D/g, '').slice(0, 11);

	// Aplicar a máscara ao CPF
	return cleanCpf
		.replace(/(\d{3})(\d)/, '$1.$2') // Adicionar o primeiro ponto
		.replace(/(\d{3})(\d)/, '$1.$2') // Adicionar o segundo ponto
		.replace(/(\d{3})(\d{2})$/, '$1-$2'); // Adicionar o traço
}
