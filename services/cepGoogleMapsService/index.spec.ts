import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CepGoogleMapsService } from './CepGoogleMapsService';
import type { AddressData } from './type';

vi.mock('node-fetch', () => ({
    default: vi.fn(),
}));

import fetch from 'node-fetch';
const { Response } = fetch;

describe('CepGoogleMapsService', () => {
    const mockBaseUrl = 'https://mock-base-url.com/api/caps/cep';
    const mockCep = '12345678';

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should return address data when API responds with valid data', async () => {
        const mockAddressData: AddressData = {
            cep: '12345678',
            street: 'Mock Street',
            neighborhood: 'Mock Neighborhood',
            city: 'Mock City',
            state: 'Mock State',
            address: 'Mock Address',
            lat: '123.456',
            lng: '-123.456',
        };

        (fetch as vi.Mock).mockResolvedValue(
            new Response(JSON.stringify(mockAddressData), { status: 200 })
        );

        const result = await CepGoogleMapsService(mockCep);

        expect(result).toEqual(mockAddressData);
        expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/${mockCep}`);
    });

    it('should return default address data when API responds with non-200 status', async () => {
        (fetch as vi.Mock).mockResolvedValue(new Response('Not Found', { status: 404 }));

        const result = await CepGoogleMapsService(mockCep);

        expect(result).toEqual({
            cep: '',
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            address: '',
            lat: '',
            lng: '',
        });

        expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/${mockCep}`);
    });

    it('should return default address data when API response is not valid JSON', async () => {
        (fetch as vi.Mock).mockResolvedValue(new Response('Invalid JSON', { status: 200 }));

        const result = await CepGoogleMapsService(mockCep);

        expect(result).toEqual({
            cep: '',
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            address: '',
            lat: '',
            lng: '',
        });

        expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/${mockCep}`);
    });

    it('should return default address data when fetch throws an error', async () => {
        const mockError = new Error('Network error');

        (fetch as vi.Mock).mockRejectedValue(mockError);

        const result = await CepGoogleMapsService(mockCep);

        expect(result).toEqual({
            cep: '',
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            address: '',
            lat: '',
            lng: '',
        });

        expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}/${mockCep}`);
    });

    it('should log an error when fetch throws an error', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const mockError = new Error('Network error');

        (fetch as vi.Mock).mockRejectedValue(mockError);

        await CepGoogleMapsService(mockCep);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'An unexpected error occurred while fetching address data:',
            mockError
        );

        consoleErrorSpy.mockRestore();
    });
});
