import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchHighlightedProducts } from './fetchHighlightedProducts';
import { authorizedApi } from '@/lib';
import type { IProduct } from '@/dtos';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('fetchHighlightedProducts', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;
	const mockRequestBody = { type: 'highlights', value: '' };

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mock environment variable
	});

	it('should return highlighted products when the API responds successfully', async () => {
		const mockProducts: IProduct[] = [
			{ id: 1, name: 'Product 1', description: 'Description 1', price: 10 },
			{ id: 2, name: 'Product 2', description: 'Description 2', price: 20 },
		];

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockProducts,
		});

		const result = await fetchHighlightedProducts();

		expect(result).toEqual({ data: mockProducts, status: 200 });
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockRequestBody);
	});

	it('should return an empty product list and the status if the API responds with a non-200 status', async () => {
		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 404,
			data: [],
		});

		const result = await fetchHighlightedProducts();

		expect(result).toEqual({ data: [], status: 404 });
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockRequestBody);
	});

	it('should handle API errors gracefully and return status 500', async () => {
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const result = await fetchHighlightedProducts();

		expect(result).toEqual({ data: [], status: 500 });
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockRequestBody);
	});

	it('should log an error when an exception is thrown', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		await fetchHighlightedProducts();

		expect(consoleErrorSpy).toHaveBeenCalledWith('Error in HighlightService:', mockError);

		consoleErrorSpy.mockRestore();
	});
});
