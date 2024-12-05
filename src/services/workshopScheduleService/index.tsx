'use server';

import { env } from 'next-runtime-env';

import type { AvailableDate } from './type';

export async function WorkshopScheduleService({
  code,
}: { code: string }): Promise<AvailableDate[]> {
  const baseUrl = env('NEXT_PUBLIC_API_NEXT_BASE_URL');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_API_NEXT_BASE_URL');
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/api/caps/workshop/${code}/schedule`);

    if (!response.ok) {
      console.warn(`Erro ao buscar código do workshop [${code}]: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na WorkshopScheduleService:', error);
    return [];
  }
}
