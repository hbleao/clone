import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPostalStates } from './fetchPostalStates';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		get: vi.fn(),
	},
}));

describe('fetchPostalStates', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/estado`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockar variável de ambiente
	});

	it('should return states data when API responds successfully', async () => {
		const mockData = [
			{ id: 1, state: 'São Paulo' },
			{ id: 2, state: 'Rio de Janeiro' },
		];

		(authorizedApi.get as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchPostalStates();

		expect(result).toEqual({ states: mockData });
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
	});

	it('should return an empty states array when API responds with non-200 status', async () => {
		(authorizedApi.get as vi.Mock).mockResolvedValue({
			status: 500,
			data: null,
		});

		const result = await fetchPostalStates();

		expect(result).toEqual({ states: [] });
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
	});

	it('should return an empty states array when API call fails', async () => {
		const mockError = new Error('Network error');

		(authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

		const result = await fetchPostalStates();

		expect(result).toEqual({ states: [] });
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
	});

	it('should log an error when API call fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockError = new Error('Network error');

		(authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

		await fetchPostalStates();

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch postal states:', mockError);
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);

		consoleErrorSpy.mockRestore();
	});
});
