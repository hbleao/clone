'use server';

import type { Workshop } from '@/templates/workshopFlow/Address/reducer/types';
import { env } from 'next-runtime-env';

export async function WorkshopByLatLngService(
  lat: string,
  lng: string,
): Promise<Workshop[]> {
  const baseUrl = env('NEXT_PUBLIC_API_NEXT_BASE_URL');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_API_NEXT_BASE_URL');
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/api/caps/workshops?lat=${lat}&lng=${lng}`);

    if (!response.ok) {
      console.warn(`Erro ao buscar workshops: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na WorkshopByLatLngService:', error);
    return [];
  }
}
