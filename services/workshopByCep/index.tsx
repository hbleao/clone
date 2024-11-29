'use server';

import type { Workshop } from '@/templates/workshopFlow/Address/reducer/types';
import { env } from 'next-runtime-env';

export async function WorkshopByLatLngService(
	lat: string,
	lng: string,
): Promise<Workshop[]> {
	const response = await fetch(
		`${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/api/caps/workshops?lat=${lat}&lng=${lng}`,
	);

	if (!response.ok) {
		throw new Error(
			`Error fetching workshops for coordinates (lat: ${lat}, lng: ${lng}): ${response.status} ${response.statusText}`,
		);
	}

	if (response.status === 200) {
		const data = await response.json();
		return data;
	}

	return [];
}
