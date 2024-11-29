'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

export async function CepService({ cep }: any) {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_PATH')}/hub-vendas-carbon/auxiliar/v1/guia-postal/cep?zipCode=${cep}`;

	const httpResponse = await authorizedApi.get(endpoint);

	return httpResponse.data;
}
