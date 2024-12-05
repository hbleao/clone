'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

interface PostalStatesServiceResponse {
  estads: any[];
}

export async function PostalStatesService(): Promise<PostalStatesServiceResponse> {
  const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
    return { estads: [] };
  }

  const endpoint = `${baseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/estado`;

  try {
    const response = await authorizedApi.get(endpoint);
    if (response.status !== 200) {
      console.error(`Erro: ${response.data}`);
      return { estads: [] };
    }
    return { estads: response.data };
  } catch (error) {
    console.error('Falha ao buscar estados postais:', error);
    return { estads: [] };
  }
}
