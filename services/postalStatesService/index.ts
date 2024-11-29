'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

export async function PostalStatesService() {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/auxiliar/v1/guia-postal/estado`;

	try {
		const response = await authorizedApi.get(endpoint);
		if (response.status !== 200) {
			throw new Error(`Error: ${response.data}`);
		}
		return await response.data;
	} catch (error) {
		console.error('Failed to fetch postal states:', error);
		return { estads: [] };
	}
}
