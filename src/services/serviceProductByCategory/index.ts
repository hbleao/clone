'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { IProduct } from '@/dtos';

import type { ServiceProductByCategoryProps } from './types';

export async function ServiceProductByCategory({
	value,
}: ServiceProductByCategoryProps) {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	const body = { type: 'categories', value };

	const httpResponse = await authorizedApi.post<IProduct[]>(endpoint, body);

	if (httpResponse.status !== 200 || !Array.isArray(httpResponse.data))
		return { data: [] as IProduct[], status: httpResponse.status };

	return { data: httpResponse.data, status: httpResponse.status };
}
