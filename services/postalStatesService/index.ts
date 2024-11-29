

'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

/**
 * Serviço para buscar informações dos estados no guia postal.
 * @returns Um objeto contendo os estados ou um objeto padrão com uma lista vazia em caso de erro.
 */
export async function fetchPostalStates(): Promise<{ states: any[] }> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/estado`;

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.get(endpoint);

		// Verificar se o status da resposta é 200
		if (response.status !== 200) {
			throw new Error(`Unexpected response: ${response.data}`);
		}

		// Retornar os dados dos estados
		return { states: response.data };
	} catch (error) {
		// Logar o erro e retornar uma estrutura padrão
		console.error('Failed to fetch postal states:', error);
		return { states: [] };
	}
}
