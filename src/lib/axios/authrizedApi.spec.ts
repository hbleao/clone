// npm install --save-dev vitest @testing-library/jest-dom

import { describe, it, expect, vi } from 'vitest';
import { authorizedApi } from './path/to/your/authorizedApi'; // ajuste o caminho conforme necessário
import { AuthorizationService } from '@/services/authorizationService';
import axios from 'axios';

// Mock do AuthorizationService
vi.mock('@/services/authorizationService', () => ({
    AuthorizationService: vi.fn(),
}));

describe('authorizedApi', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Limpa os mocks antes de cada teste
    });

    describe('addAuthToken', () => {
        it('should add Authorization header if access_token is present', async () => {
            const mockToken = 'mockAccessToken';
            (AuthorizationService as vi.Mock).mockResolvedValue({ access_token: mockToken });

            const config = { headers: {} };
            await authorizedApi.interceptors.request.handlers[0].fulfilled(config);

            expect(config.headers.Authorization).toBe(`Bearer ${mockToken}`);
        });

        it('should not add Authorization header if access_token is not present', async () => {
            (AuthorizationService as vi.Mock).mockResolvedValue({ access_token: null });

            const config = { headers: {} };
            await authorizedApi.interceptors.request.handlers[0].fulfilled(config);

            expect(config.headers.Authorization).toBeUndefined();
        });

        it('should handle errors when retrieving access_token', async () => {
            (AuthorizationService as vi.Mock).mockRejectedValue(new Error('Token error'));

            const config = { headers: {} };
            await authorizedApi.interceptors.request.handlers[0].fulfilled(config);

            expect(config.headers.Authorization).toBeUndefined();
            // Aqui você pode adicionar mais verificações se necessário
        });
    });

    describe('response interceptor', () => {
        it('should return the response as is', async () => {
            const response = { data: 'response data' };
            const result = authorizedApi.interceptors.response.handlers[0].fulfilled(response);
            expect(result).toBe(response);
        });

        it('should handle errors in response', async () => {
            const error = new Error('Response error');
            const rejected = authorizedApi.interceptors.response.handlers[0].rejected(error);
            await expect(rejected).rejects.toThrow('Response error');
        });
    });
});