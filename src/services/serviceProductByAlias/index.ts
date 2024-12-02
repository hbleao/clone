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
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/produtos`;
	const body = JSON.stringify({ type: 'productAlias', value });

	try {
		const httpResponse =
			await authorizedApi.post<ServiceProductByProductAliasResult>(
				endpoint,
				body,
			);

		if (httpResponse.status === 200) {
			return httpResponse.data;
		}

		console.error(`Error: Received status ${httpResponse.status}`);
	} catch (error) {
		console.error('Request failed:', error);
	}

	return {} as ServiceProductByProductAliasResult;
}
