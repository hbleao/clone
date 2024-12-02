'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

export async function PostalCepService(
	stateName: string,
	cityName: string,
	addressName: string,
) {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/auxiliar/v1/guia-postal/logradouro?perPage=5&stateAcronym=${stateName}&locationName=${cityName}&addressName=${addressName}`;

	try {
		const response = await authorizedApi.get(endpoint);
		if (response.status !== 200) {
			return [];
		}
		return response.data;
	} catch (error) {
		console.error('Failed to fetch postal data:', error);
		return [];
	}
}
