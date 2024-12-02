'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type { ICategory } from '@/dtos';

const BASE_URL = env('NEXT_PUBLIC_CARBON_BASE_URL');
const CATEGORIES_ENDPOINT = `${BASE_URL}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

/**
 * Serviço para buscar categorias a partir da API autorizada.
 * @returns Uma lista de categorias formatada ou uma lista vazia em caso de erro.
 */
export async function AllCategoriesServices(): Promise<ICategory[]> {
    const requestBody = { type: 'categories', value: '' };

    try {
        // Chamada à API autorizada
        const response = await authorizedApi.post<ICategory[]>(CATEGORIES_ENDPOINT, requestBody);

        // Verificação do status e validade dos dados recebidos
        if (response.status === 200 && Array.isArray(response.data)) {
            return response.data;
        } 
            console.error('Failed to fetch categories:', {
                status: response.status,
                data: response.data,
            });
            return [];
        
    } catch (error) {
        // Captura e log de erros durante a chamada à API
        console.error('Error fetching categories:', error);
        return [];
    }
}


