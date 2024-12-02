'use server';
import { env } from 'next-runtime-env';

import { api } from '@/lib';

import type { IProduct } from '@/dtos';

import { formatAemImageUrl } from '@/utils';

export async function CapsServicesService() {
	const endpoint = `${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/api/caps/servicos`;

	const httpResponse = await api.get<IProduct[]>(endpoint);

	if (!Array.isArray(httpResponse.data)) {
		throw new Error('CapsServicesService: Something went wrong!');
	}

	if (httpResponse.status !== 200) {
		throw new Error('CapsServicesService: Internal server error');
	}

	const response = {
		...httpResponse,
		data: httpResponse.data.map((card) => ({
			...card,
			image: {
				src: formatAemImageUrl(card.image.src),
				alt: card.image.alt,
			},
		})),
	};

	return response;
}
