import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthorizationService } from './AuthorizationService';
import { api } from '@/lib';
import { env } from 'next-runtime-env';
import type { AuthorizationServiceResponse } from './types';

vi.mock('@/lib', () => ({
    api: {
        post: vi.fn(),
    },
}));

vi.mock('next-runtime-env', () => ({
    env: vi.fn(),
}));

describe('AuthorizationService', () => {
    const mockBaseUrl = 'https://mock-base-url.com';
    const mockToken = 'mock-token';
    const mockTokenEndpoint = `${mockBaseUrl}/oauth/v2/access-token`;

    beforeEach(() => {
        vi.clearAllMocks();

        // Mockando o valor do ambiente
        (env as vi.Mock).mockImplementation((key: string) => {
            if (key === 'NEXT_PUBLIC_CARBON_BASE_URL') {
                return mockBaseUrl;
            }
            return '';
        });

        // Mockando o token de autorização
        process.env.TOKEN = mockToken;
    });

    it('should return data when the API call is successful with a valid token', async () => {
        const mockResponse: AuthorizationServiceResponse = {
            access_token: 'valid-token',
        };

        (api.post as vi.Mock).mockResolvedValue({
            status: 200,
            data: mockResponse,
        });

        const result = await AuthorizationService();

        expect(result).toEqual(mockResponse);
        expect(api.post).toHaveBeenCalledWith(
            mockTokenEndpoint,
            expect.any(URLSearchParams),
            {
                headers: {
                    Authorization: `Basic ${mockToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
    });

    it('should return an empty token when the API call is successful but access_token is missing', async () => {
        const mockResponse = {
            access_token: undefined,
        };

        (api.post as vi.Mock).mockResolvedValue({
            status: 200,
            data: mockResponse,
        });

        const result = await AuthorizationService();

        expect(result).toEqual({ access_token: '' });
        expect(api.post).toHaveBeenCalled();
    });

    it('should return an empty token when the API call fails with status other than 200', async () => {
        (api.post as vi.Mock).mockResolvedValue({
            status: 401,
            data: {},
        });

        const result = await AuthorizationService();

        expect(result).toEqual({ access_token: '' });
        expect(api.post).toHaveBeenCalled();
    });

    it('should return an empty token when an error occurs during the API call', async () => {
        (api.post as vi.Mock).mockRejectedValue(new Error('Network error'));

        const result = await AuthorizationService();

        expect(result).toEqual({ access_token: '' });
        expect(api.post).toHaveBeenCalled();
    });

    it('should log an error when an exception is thrown during the API call', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const errorMessage = 'Network error';

        (api.post as vi.Mock).mockRejectedValue(new Error(errorMessage));

        await AuthorizationService();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error during authorization:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('should log an error when the API call fails with status other than 200', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        (api.post as vi.Mock).mockResolvedValue({
            status: 401,
            data: {},
        });

        await AuthorizationService();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Authorization failed:', {
            status: 401,
            data: {},
        });

        consoleErrorSpy.mockRestore();
    });
});
