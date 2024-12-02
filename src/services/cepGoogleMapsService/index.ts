
'use server';

import { env } from 'next-runtime-env';
import type { AddressData } from './type';

const BASE_URL = env('NEXT_PUBLIC_API_NEXT_BASE_URL');

/**
 * Constrói a URL do endpoint para buscar informações do CEP.
 * @param cep O CEP a ser consultado.
 * @returns A URL completa do endpoint.
 */
const buildCepEndpoint = (cep: string): string => `${BASE_URL}/api/caps/cep/${cep}`;

/**
 * Serviço para buscar informações de endereço com base no CEP.
 * @param cep O CEP a ser consultado.
 * @returns Os dados do endereço ou um objeto padrão em caso de erro.
 */
export async function CepGoogleMapsService(cep: string): Promise<AddressData> {
    const defaultAddressData: AddressData = {
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        address: '',
        lat: '',
        lng: '',
    };

    try {
        const endpoint = buildCepEndpoint(cep);
        const response = await fetch(endpoint);

        if (!response.ok) {
            console.error(`Error fetching data for CEP ${cep}: ${response.status} ${response.statusText}`);
            return defaultAddressData;
        }

        const data: AddressData = await response.json();
        return data;
    } catch (error) {
        console.error('An unexpected error occurred while fetching address data:', error);
        return defaultAddressData;
    }
}


