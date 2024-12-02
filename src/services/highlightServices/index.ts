'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { IProduct } from '@/dtos';

export async function HighlightService(): Promise<{
	data: IProduct[];
	status: number;
}> {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	const body = { type: 'highlights', value: '' };

	const httpResponse = await authorizedApi.post<IProduct[]>(endpoint, body);

	if (httpResponse.status !== 200) {
		return {
			data: [] as IProduct[],
			status: httpResponse.status,
		};
	}
	return { data: httpResponse.data, status: httpResponse.status };
}
