'use server';

import { env } from 'next-runtime-env';
import type { AxiosResponse } from 'axios';

import { authorizedApi } from '@/lib';

interface CepResponse {
  data: any;
}

export async function CepService({ cep }: { cep: string }): Promise<CepResponse | null> {
  const basePath = env('NEXT_PUBLIC_CARBON_BASE_PATH');

  if (!basePath) {
    console.error('Missing environment variable: NEXT_PUBLIC_CARBON_BASE_PATH');
    return null;
  }

  const endpoint = `${basePath}/hub-vendas-carbon/auxiliar/v1/guia-postal/cep?zipCode=${cep}`;

  try {
    const httpResponse: AxiosResponse = await authorizedApi.get(endpoint);

    if (httpResponse.status !== 200) {
      console.warn(`CepService: Unexpected status code ${httpResponse.status}`);
      return null;
    }

    return { data: httpResponse.data };
  } catch (error) {
    console.error('Error in CepService:', error);
    return null;
  }
}
