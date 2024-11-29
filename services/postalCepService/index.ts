

'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

/**
 * Serviço para buscar informações postais com base no estado, cidade e endereço.
 * @param stateName Nome ou sigla do estado.
 * @param cityName Nome da cidade.
 * @param addressName Nome do logradouro.
 * @returns Uma lista de informações postais ou uma lista vazia em caso de erro.
 */
export async function fetchPostalAddresses(
	stateName: string,
	cityName: string,
	addressName: string,
): Promise<any[]> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/logradouro?perPage=5&stateAcronym=${stateName}&locationName=${cityName}&addressName=${addressName}`;

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.get(endpoint);

		// Validar o status da resposta
		if (response.status !== 200) {
			console.error(`PostalCepService: Unexpected status code ${response.status}`);
			return [];
		}

		// Retornar os dados da resposta
		return response.data;
	} catch (error) {
		// Logar erros inesperados e retornar lista vazia
		console.error('Failed to fetch postal data:', error);
		return [];
	}
}
