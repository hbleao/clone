'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { IProduct } from '@/dtos';

export async function HighlightService(): Promise<{
	data: IProduct[];
	status: number;
}> {
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

	if (!baseUrl) {
		console.error('Missing environment variable: NEXT_PUBLIC_CARBON_BASE_URL');
		return { data: [], status: 500 };
	}

	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;
	const body = { type: 'highlights', value: '' };

	try {
		const httpResponse = await authorizedApi.post<IProduct[]>(endpoint, body);

		if (httpResponse.status !== 200) {
			console.warn(`HighlightService: Unexpected status code ${httpResponse.status}`);
			return { data: [], status: httpResponse.status };
		}

		return { data: httpResponse.data, status: httpResponse.status };
	} catch (error) {
		console.error('Error in HighlightService:', error);
		return { data: [], status: 500 };
	}
}
