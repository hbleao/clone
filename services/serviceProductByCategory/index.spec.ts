import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProductsByCategory } from './fetchProductsByCategory';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('fetchProductsByCategory', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return products when API responds successfully', async () => {
		const mockValue = 'example-category';
		const mockData = [
			{ id: 1, name: 'Product A' },
			{ id: 2, name: 'Product B' },
		];

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchProductsByCategory({ value: mockValue });

		expect(result).toEqual({ data: mockData, status: 200 });
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			{ type: 'categories', value: mockValue },
		);
	});

	it('should return an empty list when API responds with non-200 status', async () => {
		const mockValue = 'example-category';

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 404,
			data: null,
		});

		const result = await fetchProductsByCategory({ value: mockValue });

		expect(result).toEqual({ data: [], status: 404 });
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			{ type: 'categories', value: mockValue },
		);
	});

	it('should return an empty list when API responds with invalid data', async () => {
		const mockValue = 'example-category';

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: null,
		});

		const result = await fetchProductsByCategory({ value: mockValue });

		expect(result).toEqual({ data: [], status: 200 });
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			{ type: 'categories', value: mockValue },
		);
	});

	it('should return an empty list and log an error when API call fails', async () => {
		const mockValue = 'example-category';
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = await fetchProductsByCategory({ value: mockValue });

		expect(result).toEqual({ data: [], status: 500 });
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Failed to fetch products by category:',
			mockError,
		);

		consoleErrorSpy.mockRestore();
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			{ type: 'categories', value: mockValue },
		);
	});
});
