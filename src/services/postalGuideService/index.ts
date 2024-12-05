'use server';

import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';

interface PostalGuideServiceResponse {
  data: any[];
}

export async function PostalGuideService(state: string): Promise<PostalGuideServiceResponse> {
  const controller = new AbortController();
  const signal = controller.signal;

  const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
    return { data: [] };
  }

  const endpoint = `${baseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/localidade?stateAcronym=${state}&page=0&perPage=999`;

  try {
    const response = await authorizedApi.get(endpoint, { signal });
    if (!response) {
      console.error('Erro ao buscar dados: Resposta vazia');
      return { data: [] };
    }
    return { data: response.data };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Requisição foi abortada');
    } else {
      console.error('Falha ao buscar dados do guia postal:', error);
    }
    return { data: [] };
  }
}
