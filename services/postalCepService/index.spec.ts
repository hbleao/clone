import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPostalAddresses } from './fetchPostalAddresses';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		get: vi.fn(),
	},
}));

describe('fetchPostalAddresses', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/auxiliar/v1/guia-postal/logradouro?perPage=5&stateAcronym=SP&locationName=Sao%20Paulo&addressName=Paulista`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockando a variável de ambiente
	});

	it('should return postal data when API responds successfully', async () => {
		const mockData = [
			{ id: 1, address: 'Av. Paulista, 1000', city: 'São Paulo', state: 'SP' },
			{ id: 2, address: 'Av. Paulista, 2000', city: 'São Paulo', state: 'SP' },
		];

		(authorizedApi.get as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchPostalAddresses('SP', 'Sao Paulo', 'Paulista');

		expect(result).toEqual(mockData);
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
	});

	it('should return an empty array when API responds with non-200 status', async () => {
		(authorizedApi.get as vi.Mock).mockResolvedValue({
			status: 404,
			data: [],
		});

		const result = await fetchPostalAddresses('SP', 'Sao Paulo', 'Paulista');

		expect(result).toEqual([]);
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
	});

	it('should return an empty array when API call fails', async () => {
		const mockError = new Error('Network error');

		(authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

		const result = await fetchPostalAddresses('SP', 'Sao Paulo', 'Paulista');

		expect(result).toEqual([]);
		expect(authorizedApi.get).toHaveBeenCalledWith(mockEndpoint);
	});

	it('should log an error when API call fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockError = new Error('Network error');

		(authorizedApi.get as vi.Mock).mockRejectedValue(mockError);

		await fetchPostalAddresses('SP', 'Sao Paulo', 'Paulista');

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch postal data:', mockError);

		consoleErrorSpy.mockRestore();
	});
});
