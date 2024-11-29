
'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type {
	ServiceFilterByValueProps,
	ServiceFilterByValueServiceResult,
} from './types';

/**
 * Serviço para filtrar serviços com base em um valor.
 * @param value O valor pelo qual os serviços serão filtrados.
 * @returns Uma lista de serviços filtrados ou uma lista vazia em caso de erro.
 */
export async function fetchFilteredServices({
	value,
}: ServiceFilterByValueProps): Promise<ServiceFilterByValueServiceResult> {
	// Construir o endpoint
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	// Construir o corpo da requisição
	const requestBody = JSON.stringify({ type: 'filter', value });

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.post<ServiceFilterByValueServiceResult>(
			endpoint,
			requestBody,
		);

		// Retornar os dados se a resposta for bem-sucedida
		if (response.status === 200) {
			return response.data;
		}

		// Retornar uma lista vazia para status diferente de 200
		return [] as ServiceFilterByValueServiceResult;
	} catch (error) {
		// Logar erros inesperados
		console.error('Failed to fetch filtered services:', error);

		// Retornar uma lista vazia em caso de exceção
		return [] as ServiceFilterByValueServiceResult;
	}
}
