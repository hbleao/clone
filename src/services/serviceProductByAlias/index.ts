'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';
import type {
	ServiceProductByProductAliasProps,
	ServiceProductByProductAliasResult,
} from './types';

export async function ServiceProductByProductAlias({
	value,
}: ServiceProductByProductAliasProps): Promise<ServiceProductByProductAliasResult> {
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

	if (!baseUrl) {
		console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
		return {} as ServiceProductByProductAliasResult;
	}

	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;
	const body = JSON.stringify({ type: 'productAlias', value });

	try {
		const httpResponse = await authorizedApi.post<ServiceProductByProductAliasResult>(
			endpoint,
			body,
		);

		if (httpResponse.status === 200) {
			return httpResponse.data;
		}

		console.warn(`ServiceProductByProductAlias: Código de status inesperado ${httpResponse.status}`);
	} catch (error) {
		console.error('Erro na ServiceProductByProductAlias:', error);
	}

	return {} as ServiceProductByProductAliasResult;
}
