import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AllCategoriesServices } from './AllCategoriesServices';
import { authorizedApi } from '@/lib';
import { env } from 'next-runtime-env';
import type { ICategory } from '@/dtos';

vi.mock('@/lib', () => ({
    authorizedApi: {
        post: vi.fn(),
    },
}));

vi.mock('next-runtime-env', () => ({
    env: vi.fn(),
}));

describe('AllCategoriesServices', () => {
    const mockBaseUrl = 'https://mock-base-url.com';
    const mockCategoriesEndpoint = `${mockBaseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

    beforeEach(() => {
        vi.clearAllMocks();

        // Mockando o valor do ambiente
        (env as vi.Mock).mockImplementation((key: string) => {
            if (key === 'NEXT_PUBLIC_CARBON_BASE_URL') {
                return mockBaseUrl;
            }
            return '';
        });
    });

    it('should return an array of categories when the API call is successful', async () => {
        const mockCategories: ICategory[] = [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
        ];

        // Mockando a resposta bem-sucedida da API
        (authorizedApi.post as vi.Mock).mockResolvedValue({
            status: 200,
            data: mockCategories,
        });

        const result = await AllCategoriesServices();

        expect(result).toEqual(mockCategories);
        expect(authorizedApi.post).toHaveBeenCalledWith(mockCategoriesEndpoint, {
            type: 'categories',
            value: '',
        });
    });

    it('should return an empty array when the API call is successful but data is not an array', async () => {
        const mockResponse = {
            status: 200,
            data: { message: 'Not an array' },
        };

        (authorizedApi.post as vi.Mock).mockResolvedValue(mockResponse);

        const result = await AllCategoriesServices();

        expect(result).toEqual([]);
        expect(authorizedApi.post).toHaveBeenCalledWith(mockCategoriesEndpoint, {
            type: 'categories',
            value: '',
        });
    });

    it('should return an empty array when the API call fails with a status other than 200', async () => {
        const mockResponse = {
            status: 500,
            data: null,
        };

        (authorizedApi.post as vi.Mock).mockResolvedValue(mockResponse);

        const result = await AllCategoriesServices();

        expect(result).toEqual([]);
        expect(authorizedApi.post).toHaveBeenCalledWith(mockCategoriesEndpoint, {
            type: 'categories',
            value: '',
        });
    });

    it('should return an empty array when an error occurs during the API call', async () => {
        const errorMessage = 'Network error';

        (authorizedApi.post as vi.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await AllCategoriesServices();

        expect(result).toEqual([]);
        expect(authorizedApi.post).toHaveBeenCalledWith(mockCategoriesEndpoint, {
            type: 'categories',
            value: '',
        });
    });

    it('should log an error when an exception is thrown during the API call', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const errorMessage = 'Network error';

        (authorizedApi.post as vi.Mock).mockRejectedValue(new Error(errorMessage));

        await AllCategoriesServices();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching categories:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('should log an error when the API call fails with status other than 200', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const mockResponse = {
            status: 500,
            data: null,
        };

        (authorizedApi.post as vi.Mock).mockResolvedValue(mockResponse);

        await AllCategoriesServices();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch categories:', {
            status: 500,
            data: null,
        });

        consoleErrorSpy.mockRestore();
    });
});
