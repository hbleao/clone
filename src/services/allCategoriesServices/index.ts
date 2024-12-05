'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type { ICategory } from '@/dtos';

export async function AllCategoriesServices(): Promise<ICategory[]> {
  const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/produtos`;
  const requestBody = { type: 'categories', value: '' };

  try {
    const response = await authorizedApi.post<ICategory[]>(endpoint, requestBody);
    
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn('AllCategoriesServices: Invalid response format or status');
    return [];
  } catch (error) {
    console.error('Error in AllCategoriesServices:', error);
    return [];
  }
}
