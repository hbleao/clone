'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { WorkshopAppointment } from './types';

export async function WorkshopFinalizeAppointment(
	appointment: WorkshopAppointment,
): Promise<boolean> {
	try {
		const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/aquisicao/v1/caps/email`;
		const response = await authorizedApi.post(endpoint, appointment);

		if (response.status !== 200) {
			throw new Error(
				`Error ${response.status}: ${response.data.message || 'Unexpected error occurred'}`,
			);
		}

		return true;
	} catch (error) {
		console.error('Failed to finalize appointment:', error);
		throw new Error(
			`Failed to finalize appointment: ${error.message || 'An unexpected error occurred.'}`,
		);
	}
}
