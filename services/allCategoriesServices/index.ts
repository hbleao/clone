'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { ICategory } from '@/dtos';

export async function AllCategoriesServices() {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	const body = { type: 'categories', value: '' };

	const httpResponse = await authorizedApi.post<ICategory[]>(endpoint, body);

	if (httpResponse.status !== 200 || !Array.isArray(httpResponse.data))
		return [] as ICategory[];

	return httpResponse.data;
}
