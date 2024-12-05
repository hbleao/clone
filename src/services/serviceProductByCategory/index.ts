'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { IProduct } from '@/dtos';

import type { ServiceProductByCategoryProps, ServiceProductByCategoryResult } from './types';

export async function ServiceProductByCategory({
	value,
}: ServiceProductByCategoryProps): Promise<{ data: ServiceProductByCategoryResult[]; status: number }> {
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

	if (!baseUrl) {
		console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
		return { data: [], status: 500 };
	}

	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	const body = { type: 'categories', value };

	try {
		const httpResponse = await authorizedApi.post<IProduct[]>(endpoint, body);

		if (httpResponse.status !== 200 || !Array.isArray(httpResponse.data)) {
			console.warn(`ServiceProductByCategory: Código de status inesperado ${httpResponse.status}`);
			return { data: [], status: httpResponse.status };
		}

		return { data: httpResponse.data, status: httpResponse.status };
	} catch (error) {
		console.error('Erro na ServiceProductByCategory:', error);
		return { data: [], status: 500 };
	}
}
