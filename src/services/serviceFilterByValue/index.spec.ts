import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFilteredServices } from './fetchFilteredServices';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('fetchFilteredServices', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return filtered services when API responds successfully', async () => {
		const mockValue = 'example-filter';
		const mockData = [
			{ id: 1, name: 'Service A' },
			{ id: 2, name: 'Service B' },
		];

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchFilteredServices({ value: mockValue });

		expect(result).toEqual(mockData);
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({ type: 'filter', value: mockValue }),
		);
	});

	it('should return an empty list when API responds with non-200 status', async () => {
		const mockValue = 'example-filter';

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 404,
			data: null,
		});

		const result = await fetchFilteredServices({ value: mockValue });

		expect(result).toEqual([]);
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({ type: 'filter', value: mockValue }),
		);
	});

	it('should return an empty list and log an error when API call fails', async () => {
		const mockValue = 'example-filter';
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = await fetchFilteredServices({ value: mockValue });

		expect(result).toEqual([]);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch filtered services:', mockError);

		consoleErrorSpy.mockRestore();
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({ type: 'filter', value: mockValue }),
		);
	});
});
