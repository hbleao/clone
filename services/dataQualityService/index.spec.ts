import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateDataQuality } from './validateDataQuality';
import { authorizedApi } from '@/lib';
import type {
    DataQualityServiceProps,
    DataQualityServiceResponse,
} from './types';

vi.mock('@/lib', () => ({
    authorizedApi: {
        get: vi.fn(),
    },
}));

describe('validateDataQuality', () => {
    const mockBaseUrl = 'https://mock-api-base-url.com';
    const mockType = 'mockType';
    const mockParam = 'mockParam';
    const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/cliente/v1/validacoes/${mockParam}/${mockType}`;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mock environment variable
    });

    it('should validate data and return a success response', async () => {
        const mockResponse: DataQualityServiceResponse = {
            isValid: true,
        };

        (authorizedApi.get as vi.Mock).mockResolvedValue({
            status: 200,
            data: mockResponse,
        });

        const result = await validateDataQuality({ type: mockType, param: mockParam });

        expect(result).toEqual({ isValid: true, message: '' });
        expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should return a failure response if the data is invalid', async () => {
        const mockResponse: DataQualityServiceResponse = {
            isValid: false,
        };

        (authorizedApi.get as vi.Mock).mockResolvedValue({
            status: 200,
            data: mockResponse,
        });

        const result = await validateDataQuality({ type: mockType, param: mockParam });

        expect(result).toEqual({ isValid: false, message: 'Valor inválido' });
        expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should return a failure response if the API status is not 200', async () => {
        (authorizedApi.get as vi.Mock).mockResolvedValue({
            status: 500,
            data: null,
        });

        const result = await validateDataQuality({ type: mockType, param: mockParam });

        expect(result).toEqual({ isValid: false, message: 'Serviço indisponível' });
        expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should throw an error if type is missing', async () => {
        await expect(validateDataQuality({ type: '', param: mockParam })).rejects.toThrowError(
            'Both "type" and "param" are required.'
        );

        expect(authorizedApi.get).not.toHaveBeenCalled();
    });

    it('should throw an error if param is missing', async () => {
        await expect(validateDataQuality({ type: mockType, param: '' })).rejects.toThrowError(
            'Both "type" and "param" are required.'
        );

        expect(authorizedApi.get).not.toHaveBeenCalled();
    });

    it('should handle errors from the API and return a failure response', async () => {
        const mockError = new Error('Network error');

        (authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

        const result = await validateDataQuality({ type: mockType, param: mockParam });

        expect(result).toEqual({
            isValid: false,
            message: 'Erro ao validar dados. Tente novamente mais tarde.',
        });

        expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should log an error when the API throws an exception', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const mockError = new Error('Network error');

        (authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

        await validateDataQuality({ type: mockType, param: mockParam });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error in DataQualityService:', mockError);

        consoleErrorSpy.mockRestore();
    });
});
