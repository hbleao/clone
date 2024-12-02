import { NextResponse } from 'next/server';
import { formatAddress } from './formatAddress';

import { env } from 'next-runtime-env';

interface GoogleGeocodingResponse {
	results: Array<{
		formatted_address: string;
		address_components: Array<{
			long_name: string;
			short_name: string;
			types: string[];
		}>;
		geometry: {
			location: {
				lat: number;
				lng: number;
			};
		};
	}>;
	status: string;
}

export async function GET(
	_: Request,
	{ params }: { params: { number: string } },
) {
	const { number: cep } = params;
	const apiKey = env('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');

	if (!cep) {
		return NextResponse.json({ error: 'CEP não fornecido.' }, { status: 400 });
	}

	try {
		const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${apiKey}`;

		const response = await fetch(googleApiUrl);
		const data: GoogleGeocodingResponse = await response.json();

		if (data.status !== 'OK' || data.results.length === 0) {
			return NextResponse.json({ error: 'Invalid CEP' }, { status: 404 });
		}

		const addressData = formatAddress({ result: data.results[0], cep });
		return NextResponse.json(addressData, { status: 200 });
	} catch (error) {
		console.error('Something went wrong on caps cep api:', error);
		return NextResponse.json({ error: 'Internal error' }, { status: 500 });
	}
}
