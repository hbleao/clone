

'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type { IProduct } from '@/dtos';
import type { ServiceProductByCategoryProps } from './types';

/**
 * Serviço para buscar produtos com base em uma categoria.
 * @param value Valor da categoria para filtrar os produtos.
 * @returns Um objeto contendo a lista de produtos e o status da requisição.
 */
export async function fetchProductsByCategory({
	value,
}: ServiceProductByCategoryProps): Promise<{ data: IProduct[]; status: number }> {
	// Construir o endpoint
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	// Construir o corpo da requisição
	const requestBody = { type: 'categories', value };

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.post<IProduct[]>(endpoint, requestBody);

		// Validar a resposta e os dados
		if (response.status === 200 && Array.isArray(response.data)) {
			return { data: response.data, status: response.status };
		}

		// Retornar uma lista vazia para status ou dados inválidos
		return { data: [], status: response.status };
	} catch (error) {
		// Logar erros inesperados
		console.error('Failed to fetch products by category:', error);

		// Retornar uma lista vazia e status 500 em caso de erro
		return { data: [], status: 500 };
	}
}
