
/**
 * Aplica uma máscara de telefone em um número fornecido.
 * @param value O número de telefone a ser formatado (apenas números ou com caracteres mistos).
 * @returns O número formatado com máscara no formato `(XX) XXXX-XXXX` ou `(XX) XXXXX-XXXX`.
 */
export function applyPhoneMask(value: string): string {
	// Limpar caracteres não numéricos e limitar a 11 dígitos
	const cleanPhoneNumber = value.replace(/\D/g, '').slice(0, 11);

	// Escolher o formato baseado no comprimento
	if (cleanPhoneNumber.length <= 10) {
		return cleanPhoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
	}

	return cleanPhoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}
