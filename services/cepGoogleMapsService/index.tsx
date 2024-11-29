'use server';

import { env } from 'next-runtime-env';
import type { AddressData } from './type';

export async function CepGoogleMapsService(cep: string): Promise<AddressData> {
	const response = await fetch(
		`${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/api/caps/cep/${cep}`,
	);

	if (!response.ok) {
		throw new Error(
			`Error fetching data for CEP ${cep}: ${response.status} ${response.statusText}`,
		);
	}

	if (response.status === 200) {
		const data = await response.json();
		return data;
	}

	return {
		cep: '',
		street: '',
		neighborhood: '',
		city: '',
		state: '',
		address: '',
		lat: '',
		lng: '',
	};
}
