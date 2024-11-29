'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

export async function PostalGuideService(state: string) {
	const controller = new AbortController();
	const signal = controller.signal;

	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/auxiliar/v1/guia-postal/localidade?stateAcronym=${state}&page=0&perPage=999`;

	try {
		const response = await authorizedApi.get(endpoint, { signal });
		if (!response) throw new Error('Error fetching data');
		return response.data;
	} catch (error) {
		if (error.name === 'AbortError') {
			console.error('Request was aborted');
		} else {
			console.error('Failed to fetch postal guide data:', error);
		}
		throw error;
	}
}
