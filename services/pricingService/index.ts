// 'use server';
import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

export async function PricingService({ body }: any) {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/precificacao`;
	const httpResponse = await authorizedApi.post(endpoint, body);

	if (httpResponse.status === 200) {
		return {
			...httpResponse.data,
			status: httpResponse.status,
		};
	}

	return {
		status: httpResponse,
		body: {},
	};
}
