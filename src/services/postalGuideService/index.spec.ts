import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPostalGuide } from './fetchPostalGuide';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		get: vi.fn(),
	},
}));

describe('fetchPostalGuide', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/localidade?stateAcronym=SP&page=0&perPage=999`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockar variável de ambiente
	});

	it('should return postal guide data when API responds successfully', async () => {
		const mockData = [
			{ id: 1, city: 'São Paulo' },
			{ id: 2, city: 'Campinas' },
		];

		(authorizedApi.get as vi.Mock).mockResolvedValue({
			data: mockData,
		});

		const result = await fetchPostalGuide('SP');

		expect(result).toEqual(mockData);
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint, expect.any(Object));
	});

	it('should throw an error if state parameter is not provided', async () => {
		await expect(fetchPostalGuide('')).rejects.toThrowError(
			'State parameter is required and must be a string.',
		);
		expect(authorizedApi.get).not.toHaveBeenCalled();
	});

	it('should throw an error if API does not return data', async () => {
		(authorizedApi.get as vi.Mock).mockResolvedValue(null);

		await expect(fetchPostalGuide('SP')).rejects.toThrowError('Error fetching data');
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint, expect.any(Object));
	});

	it('should log an error and throw if API call fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockError = new Error('Network error');

		(authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

		await expect(fetchPostalGuide('SP')).rejects.toThrowError(mockError);

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch postal guide data:', mockError);
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint, expect.any(Object));

		consoleErrorSpy.mockRestore();
	});

	it('should log an error if request is aborted', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const abortError = new Error('Request aborted');
		abortError.name = 'AbortError';

		(authorizedApi.get as vi.Mock).mockRejectedValue(abortError);

		await expect(fetchPostalGuide('SP')).rejects.toThrowError(abortError);

		expect(consoleErrorSpy).toHaveBeenCalledWith('Request was aborted.');
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint, expect.any(Object));

		consoleErrorSpy.mockRestore();
	});
});
