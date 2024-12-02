import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPricingData } from './fetchPricingData';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('fetchPricingData', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/prestacao-servico/v1/precificacao`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return pricing data when API responds successfully', async () => {
		const mockBody = { productId: 123 };
		const mockData = { price: 100.0 };

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchPricingData(mockBody);

		expect(result).toEqual({
			data: mockData,
			status: 200,
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockBody);
	});

	it('should return an empty data object when API responds with non-200 status', async () => {
		const mockBody = { productId: 123 };

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 404,
			data: null,
		});

		const result = await fetchPricingData(mockBody);

		expect(result).toEqual({
			data: {},
			status: 404,
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockBody);
	});

	it('should return an empty data object and status 500 when API call fails', async () => {
		const mockBody = { productId: 123 };
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const result = await fetchPricingData(mockBody);

		expect(result).toEqual({
			data: {},
			status: 500,
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockBody);
	});

	it('should log an error when API call fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockBody = { productId: 123 };
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		await fetchPricingData(mockBody);

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch pricing data:', mockError);

		consoleErrorSpy.mockRestore();
	});
});
