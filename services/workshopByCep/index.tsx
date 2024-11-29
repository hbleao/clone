'use server';

import type { Workshop } from '@/templates/workshopFlow/Address/reducer/types';
import { env } from 'next-runtime-env';

/**
 * Serviço para buscar oficinas com base em coordenadas geográficas (latitude e longitude).
 * @param lat Latitude da localização.
 * @param lng Longitude da localização.
 * @returns Uma lista de oficinas ou lança um erro em caso de falha.
 */
export async function fetchWorkshopsByLatLng(
	lat: string,
	lng: string,
): Promise<Workshop[]> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_API_NEXT_BASE_URL');
	const endpoint = `${baseUrl}/api/caps/workshops?lat=${lat}&lng=${lng}`;

	try {
		// Fazer a requisição à API
		const response = await fetch(endpoint);

		// Verificar se a resposta é bem-sucedida
		if (!response.ok) {
			throw new Error(
				`Failed to fetch workshops for coordinates (lat: ${lat}, lng: ${lng}): ${response.status} ${response.statusText}`,
			);
		}

		// Processar os dados da resposta
		return await response.json();
	} catch (error) {
		// Logar erros inesperados
		console.error('Error fetching workshops:', error);

		// Retornar uma lista vazia em caso de erro
		return [];
	}
}
