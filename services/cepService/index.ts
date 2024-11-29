

'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';

/**
 * Serviço para buscar informações relacionadas a um CEP.
 * @param cep O CEP a ser consultado.
 * @returns Os dados do CEP retornados pela API.
 * @throws Lança um erro se a resposta da API falhar ou não retornar os dados esperados.
 */
export async function fetchCepDetails(cep: string): Promise<any> {
    if (!cep || typeof cep !== 'string') {
        throw new Error('Invalid CEP: A valid string is required.');
    }

    const BASE_PATH = env('NEXT_PUBLIC_CARBON_BASE_PATH');
    const endpoint = `${BASE_PATH}/hub-vendas-carbon/auxiliar/v1/guia-postal/cep?zipCode=${cep}`;

    try {
        const response = await authorizedApi.get(endpoint);

        if (!response.data) {
            throw new Error(`No data returned for CEP ${cep}`);
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching details for CEP ${cep}:`, error);
        throw new Error('Failed to fetch CEP details. Please try again later.');
    }
}
