

'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

/**
 * Serviço para buscar informações do guia postal com base no estado.
 * @param state Sigla do estado (ex.: "SP").
 * @returns Dados do guia postal do estado.
 * @throws Lança um erro se a requisição falhar ou for abortada.
 */
export async function fetchPostalGuide(state: string): Promise<any> {
	if (!state || typeof state !== 'string') {
		throw new Error('State parameter is required and must be a string.');
	}

	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/localidade?stateAcronym=${state}&page=0&perPage=999`;

	// Controlador para permitir cancelamento da requisição
	const controller = new AbortController();
	const { signal } = controller;

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.get(endpoint, { signal });

		// Validar a resposta
		if (!response || !response.data) {
			throw new Error('Error fetching data');
		}

		return response.data;
	} catch (error: any) {
		// Tratar erro de requisição abortada
		if (error.name === 'AbortError') {
			console.error('Request was aborted.');
		} else {
			console.error('Failed to fetch postal guide data:', error);
		}
		throw error;
	}
}
