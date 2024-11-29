
'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type { IProduct } from '@/dtos';

/**
 * Serviço para buscar os produtos destacados.
 * @returns Um objeto contendo a lista de produtos e o status da requisição.
 */
export async function fetchHighlightedProducts(): Promise<{
	data: IProduct[];
	status: number;
}> {
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	const requestBody = { type: 'highlights', value: '' };

	try {
		const response = await authorizedApi.post<IProduct[]>(endpoint, requestBody);

		if (response.status !== 200) {
			return {
				data: [],
				status: response.status,
			};
		}

		return {
			data: response.data,
			status: response.status,
		};
	} catch (error) {
		console.error('Error in HighlightService:', error);
		return {
			data: [],
			status: 500,
		};
	}
}
