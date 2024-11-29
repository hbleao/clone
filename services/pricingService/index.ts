
'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';

/**
 * Serviço para calcular precificação com base no corpo da requisição.
 * @param body O corpo da requisição contendo os parâmetros necessários para precificação.
 * @returns Um objeto contendo os dados da resposta e o status da requisição.
 */
export async function fetchPricingData(body: Record<string, any>): Promise<{ data: any; status: number }> {
	// Construir o endpoint
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/precificacao`;

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.post(endpoint, body);

		// Verificar o status da resposta
		if (response.status === 200) {
			return {
				data: response.data,
				status: response.status,
			};
		}

		// Retornar erro padronizado para status diferente de 200
		return {
			data: {},
			status: response.status,
		};
	} catch (error) {
		// Logar erros inesperados
		console.error('Failed to fetch pricing data:', error);

		// Retornar erro padronizado em caso de exceção
		return {
			data: {},
			status: 500,
		};
	}
}
