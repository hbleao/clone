// 'use server';
import { env } from 'next-runtime-env';
import type { PricingServiceResponse } from './types';

import { authorizedApi } from '@/lib';

export async function PricingService({ body }: { body: any }): Promise<PricingServiceResponse> {
  const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
    return { status: 500, body: {} };
  }

  const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/precificacao`;

  try {
    const httpResponse = await authorizedApi.post(endpoint, body);

    if (httpResponse.status === 200) {
      return {
        ...httpResponse.data,
        status: httpResponse.status,
      };
    }

    console.warn(`PricingService: Código de status inesperado ${httpResponse.status}`);
    return { status: httpResponse.status, body: {} };
  } catch (error) {
    console.error('Erro na PricingService:', error);
    return { status: 500, body: {} };
  }
}
