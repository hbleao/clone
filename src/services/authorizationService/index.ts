'use server';

import { env } from 'next-runtime-env';

import { api } from '@/lib';

import type { AuthorizationServiceResponse } from './types';

type ConfigHeaders = {
  headers: {
    Authorization: string;
    'Content-Type': string;
  };
};

type RequestBody = {
  grant_type: string;
};

export async function AuthorizationService(): Promise<AuthorizationServiceResponse> {
  const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
  const token = process.env.TOKEN;

  if (!baseUrl || !token) {
    console.error('Missing environment variables for AuthorizationService');
    return { access_token: '' };
  }

  const endpoint = `${baseUrl}/oauth/v2/access-token`;

  const configHeaders: ConfigHeaders = {
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const body: RequestBody = { grant_type: 'client_credentials' };

  try {
    const httpResponse = await api.post<AuthorizationServiceResponse>(endpoint, body, configHeaders);

    if (httpResponse.status !== 200 || !httpResponse.data?.access_token) {
      console.warn('AuthorizationService: Invalid response format or status');
      return { access_token: '' };
    }

    return httpResponse.data;
  } catch (error) {
    console.error('Error in AuthorizationService:', error);
    return { access_token: '' };
  }
}
