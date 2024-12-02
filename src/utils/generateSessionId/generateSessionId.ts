/**
 * Gera um ID de sessão único com base na data e hora atual e no identificador da organização.
 * @param orgId O identificador da organização.
 * @returns Um ID de sessão formatado no padrão `YYYYMMDDHHMMSSsss-RANDOM-ORGID`.
 */

export function generateSessionId(orgId: string): string {
	if (!orgId) {
		throw new Error('Organization ID is required to generate a session ID.');
	}

	const now = new Date();

	// Obter partes da data e hora
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Ajustar mês para formato MM
	const date = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

	// Gerar parte aleatória
	const randomNumber = Math.ceil(Math.random() * 1_000_000);

	// Montar o ID de sessão
	const sessionId = `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}-${randomNumber}-${orgId.toUpperCase()}`;

	return sessionId;
}
