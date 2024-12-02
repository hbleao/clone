'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';
import type {
	ServiceProductByProductAliasProps,
	ServiceProductByProductAliasResult,
} from './types';

/**
 * Serviço para buscar informações de produtos com base em um alias de produto.
 * @param value Alias do produto usado para a consulta.
 * @returns Os dados do produto correspondente ou um objeto vazio em caso de erro.
 */
export async function fetchProductByAlias({
	value,
}: ServiceProductByProductAliasProps): Promise<ServiceProductByProductAliasResult> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	// Construir o corpo da requisição
	const requestBody = JSON.stringify({ type: 'productAlias', value });

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.post<ServiceProductByProductAliasResult>(
			endpoint,
			requestBody,
		);

		// Verificar se a resposta foi bem-sucedida
		if (response.status === 200) {
			return response.data;
		}

		// Logar o erro em caso de status diferente de 200
		console.error(`Error: Received status ${response.status}`);
	} catch (error) {
		// Logar erros inesperados
		console.error('Failed to fetch product by alias:', error);
	}

	// Retornar um objeto vazio em caso de erro
	return {} as ServiceProductByProductAliasResult;
}
