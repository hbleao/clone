'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

interface PostalCepServiceResponse {
  data: any[];
}

export async function PostalCepService(
  stateName: string,
  cityName: string,
  addressName: string,
): Promise<PostalCepServiceResponse> {
  const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
    return { data: [] };
  }

  const endpoint = `${baseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/logradouro?perPage=5&stateAcronym=${stateName}&locationName=${cityName}&addressName=${addressName}`;

  try {
    const response = await authorizedApi.get(endpoint);
    if (response.status !== 200) {
      console.warn(`PostalCepService: Código de status inesperado ${response.status}`);
      return { data: [] };
    }
    return { data: response.data };
  } catch (error) {
    console.error('Erro ao buscar dados postais:', error);
    return { data: [] };
  }
}
