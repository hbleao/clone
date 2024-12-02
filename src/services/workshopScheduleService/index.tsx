'use server';

import { env } from 'next-runtime-env';
import type { AvailableDate } from './type';

/**
 * Serviço para obter datas disponíveis de agendamento em uma oficina.
 * @param code Código da oficina.
 * @returns Uma lista de datas disponíveis ou lança um erro em caso de falha.
 */
export async function fetchWorkshopSchedule({
	code,
}: {
	code: string;
}): Promise<AvailableDate[]> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_API_NEXT_BASE_URL');
	const endpoint = `${baseUrl}/api/caps/workshop/${code}/schedule`;

	try {
		// Fazer a requisição à API
		const response = await fetch(endpoint);

		// Verificar se a resposta é bem-sucedida
		if (!response.ok) {
			throw new Error(
				`Failed to fetch workshop schedule for code [${code}]: ${response.status} ${response.statusText}`,
			);
		}

		// Processar e retornar os dados
		return await response.json();
	} catch (error) {
		// Logar o erro e lançar exceção
		console.error('Error fetching workshop schedule:', error);
		throw new Error(
			error instanceof Error ? error.message : 'An unexpected error occurred.',
		);
	}
}
