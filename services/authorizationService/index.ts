'use server';

import { env } from 'next-runtime-env';

import { api } from '@/lib';

import type { AuthorizationServiceResponse } from './types';

export async function AuthorizationService() {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/oauth/v2/access-token`;

	const configHeaders = {
		headers: {
			Authorization: `Basic ${process.env.TOKEN}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	const body = { grant_type: 'client_credentials' };

	const httpResponse = await api.post<AuthorizationServiceResponse>(
		endpoint,
		body,
		configHeaders,
	);

	if (httpResponse.status !== 200 || !httpResponse.data?.access_token) {
		return { access_token: '' };
	}

	return httpResponse.data;
}
