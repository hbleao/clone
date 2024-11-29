
'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type { ScheduleServiceProps } from './types';

/**
 * Serviço para buscar disponibilidade de agendamento.
 * @param body O corpo da requisição contendo os parâmetros necessários.
 * @returns Dados de disponibilidade ou um objeto padrão em caso de erro.
 */
export async function fetchScheduleAvailability(body: ScheduleServiceProps): Promise<{
	data: any;
	status: number;
	selectedHour: string;
	selectedDate: any;
	availableDays: any[];
}> {
	// Construir o endpoint
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_ENDPOINT');
	const endpoint = `${baseUrl}/agendamento/disponibilidade`;

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.post(endpoint, body);

		// Retornar os dados se a resposta for bem-sucedida
		if (response.status === 200) {
			return {
				data: response.data,
				status: response.status,
				selectedHour: response.data.selectedHour || '',
				selectedDate: response.data.selectedDate || {},
				availableDays: response.data.availableDays || [],
			};
		}

		// Retornar um objeto padrão em caso de status diferente de 200
		return {
			data: {},
			status: response.status,
			selectedHour: '',
			selectedDate: {},
			availableDays: [],
		};
	} catch (error) {
		// Logar erros inesperados
		console.error('Failed to fetch schedule availability:', error);

		// Retornar um objeto padrão em caso de exceção
		return {
			data: {},
			status: 500,
			selectedHour: '',
			selectedDate: {},
			availableDays: [],
		};
	}
}
