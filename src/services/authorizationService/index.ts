'use server';

import { env } from 'next-runtime-env';
import { api } from '@/lib';
import type { AuthorizationServiceResponse } from './types';

// Variáveis e constantes externas centralizadas
const BASE_URL = env('NEXT_PUBLIC_CARBON_BASE_URL');
const TOKEN_ENDPOINT = `${BASE_URL}/oauth/v2/access-token`;

const getAuthorizationHeaders = () => ({
    headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

const createRequestBody = () => 
    new URLSearchParams({
        grant_type: 'client_credentials',
    });

/**
 * Serviço de autorização responsável por obter o token de acesso.
 * @returns AuthorizationServiceResponse ou um objeto com access_token vazio.
 */
export async function AuthorizationService(): Promise<AuthorizationServiceResponse | { access_token: string }> {
    const headers = getAuthorizationHeaders();
    const body = createRequestBody();

    try {
        const response = await api.post<AuthorizationServiceResponse>(TOKEN_ENDPOINT, body, headers);

        if (response.status === 200 && response.data?.access_token) {
            return response.data;
        } 
            console.error('Authorization failed:', { status: response.status, data: response.data });
            return { access_token: '' };
        
    } catch (error) {
        console.error('Error during authorization:', error);
        return { access_token: '' };
    }
}
