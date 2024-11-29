import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCepDetails } from './fetchCepDetails';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
    authorizedApi: {
        get: vi.fn(),
    },
}));

describe('fetchCepDetails', () => {
    const mockBasePath = 'https://mock-api-base-path.com';
    const mockCep = '12345678';
    const mockEndpoint = `${mockBasePath}/hub-vendas-carbon/auxiliar/v1/guia-postal/cep?zipCode=${mockCep}`;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env.NEXT_PUBLIC_CARBON_BASE_PATH = mockBasePath; // Mocking env variable
    });

    it('should fetch and return data successfully', async () => {
        const mockData = {
            street: 'Mock Street',
            city: 'Mock City',
            state: 'Mock State',
        };

        (authorizedApi.get as vi.Mock).mockResolvedValue({
            data: mockData,
        });

        const result = await fetchCepDetails(mockCep);

        expect(result).toEqual(mockData);
        expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should throw an error if no CEP is provided', async () => {
        await expect(fetchCepDetails('')).rejects.toThrowError('Invalid CEP: A valid string is required.');
        expect(authorizedApi.get).not.toHaveBeenCalled();
    });

    it('should throw an error if CEP is not a string', async () => {
        // @ts-ignore Forcing a wrong type for test purposes
        await expect(fetchCepDetails(12345678)).rejects.toThrowError('Invalid CEP: A valid string is required.');
        expect(authorizedApi.get).not.toHaveBeenCalled();
    });

    it('should throw an error if API does not return data', async () => {
        (authorizedApi.get as vi.Mock).mockResolvedValue({
            data: null,
        });

        await expect(fetchCepDetails(mockCep)).rejects.toThrowError(`No data returned for CEP ${mockCep}`);
        expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should throw an error if API call fails', async () => {
        const mockError = new Error('Network error');

        (authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

        await expect(fetchCepDetails(mockCep)).rejects.toThrowError(
            'Failed to fetch CEP details. Please try again later.'
        );

        expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should log an error when API call fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const mockError = new Error('Network error');

        (authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

        await expect(fetchCepDetails(mockCep)).rejects.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching details for CEP ${mockCep}:`, mockError);

        consoleErrorSpy.mockRestore();
    });
});
