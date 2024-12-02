'use server';

import { env } from 'next-runtime-env';
import { api } from '@/lib';
import type { IProduct } from '@/dtos';
import { formatAemImageUrl } from '@/utils';

const BASE_URL = env('NEXT_PUBLIC_API_NEXT_BASE_URL');
const CAPS_SERVICES_ENDPOINT = `${BASE_URL}/api/caps/servicos`;

export async function CapsServicesService(): Promise<IProduct[]> {
    try {
        const httpResponse = await api.get<IProduct[]>(CAPS_SERVICES_ENDPOINT);

        // Verifica se o status da resposta é 200
        if (httpResponse.status !== 200) {
            throw new Error(`CapsServicesService: Received status ${httpResponse.status}`);
        }

        // Verifica se os dados são um array
        if (!Array.isArray(httpResponse.data)) {
            throw new Error('CapsServicesService: Response data is not an array');
        }

        // Mapeia os dados para formatar as imagens
        const formattedData = httpResponse.data.map((card) => ({
            ...card,
            image: {
                src: formatAemImageUrl(card.image.src),
                alt: card.image.alt,
            },
        }));

        return formattedData;
    } catch (error) {
        console.error(error);
        throw new Error('CapsServicesService: An error occurred while fetching services');
    }
}

