'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';
import type {
	ServiceFilterByValueProps,
	ServiceFilterByValueServiceResult,
} from './types';

export async function ServiceFilterByValueService({
	value,
}: ServiceFilterByValueProps): Promise<ServiceFilterByValueServiceResult> {
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

	if (!baseUrl) {
		console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
		return [];
	}

	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	const body = JSON.stringify({ type: 'filter', value });

	try {
		const response = await authorizedApi.post<ServiceFilterByValueServiceResult>(
			endpoint,
			body,
		);

		if (response.status === 200) {
			return response.data;
		}

		console.warn(`ServiceFilterByValueService: Código de status inesperado ${response.status}`);
		return [];
	} catch (error) {
		console.error('Erro na ServiceFilterByValueService:', error);
		return [];
	}
}
