'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { WorkshopAppointment } from './types';

export async function WorkshopFinalizeAppointment(
	appointment: WorkshopAppointment,
): Promise<boolean> {
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

	if (!baseUrl) {
		console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
		return false;
	}

	try {
		const endpoint = `${baseUrl}/hub-vendas-carbon/aquisicao/v1/caps/email`;
		const response = await authorizedApi.post(endpoint, appointment);

		if (response.status !== 200) {
			console.warn(`Erro ao finalizar agendamento: ${response.status} ${response.data.message || 'Erro inesperado'}`);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Erro na WorkshopFinalizeAppointment:', error);
		return false;
	}
}
