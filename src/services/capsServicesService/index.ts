'use server';
import { env } from 'next-runtime-env';

import { api } from '@/lib';

import type { IProduct } from '@/dtos';

import { formatAemImageUrl } from '@/utils';

export async function CapsServicesService(): Promise<IProduct[]> {
  const endpoint = `${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/api/caps/servicos`;

  try {
    const httpResponse = await api.get<IProduct[]>(endpoint);

    if (httpResponse.status !== 200 || !Array.isArray(httpResponse.data)) {
      console.warn('CapsServicesService: Invalid response format or status');
      return [];
    }

    return httpResponse.data.map((card) => ({
      ...card,
      image: {
        src: formatAemImageUrl(card.image.src),
        alt: card.image.alt,
      },
    }));
  } catch (error) {
    console.error('Error in CapsServicesService:', error);
    return [];
  }
}
