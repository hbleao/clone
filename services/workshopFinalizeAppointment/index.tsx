
'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type { WorkshopAppointment } from './types';

/**
 * Serviço para finalizar um agendamento de oficina.
 * @param appointment Os dados do agendamento a serem finalizados.
 * @returns `true` se o agendamento for finalizado com sucesso, ou lança um erro em caso de falha.
 */
export async function finalizeWorkshopAppointment(
	appointment: WorkshopAppointment,
): Promise<boolean> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/aquisicao/v1/caps/email`;

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.post(endpoint, appointment);

		// Verificar o status da resposta
		if (response.status !== 200) {
			const errorMessage = response.data?.message || 'Unexpected error occurred';
			throw new Error(`API Error ${response.status}: ${errorMessage}`);
		}

		return true;
	} catch (error: any) {
		// Logar erros inesperados
		console.error('Error finalizing workshop appointment:', error);

		// Lançar uma exceção com uma mensagem detalhada
		throw new Error(
			error.message || 'An unexpected error occurred while finalizing the appointment.',
		);
	}
}
