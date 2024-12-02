import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProductByAlias } from './fetchProductByAlias';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('fetchProductByAlias', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return product data when API responds successfully', async () => {
		const mockValue = 'productAlias123';
		const mockData = { id: 1, name: 'Mock Product' };

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchProductByAlias({ value: mockValue });

		expect(result).toEqual(mockData);
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({ type: 'productAlias', value: mockValue }),
		);
	});

	it('should return an empty object when API responds with non-200 status', async () => {
		const mockValue = 'productAlias123';

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 404,
			data: null,
		});

		const result = await fetchProductByAlias({ value: mockValue });

		expect(result).toEqual({});
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({ type: 'productAlias', value: mockValue }),
		);
	});

	it('should return an empty object and log an error when API call fails', async () => {
		const mockValue = 'productAlias123';
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = await fetchProductByAlias({ value: mockValue });

		expect(result).toEqual({});
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Failed to fetch product by alias:',
			mockError,
		);

		consoleErrorSpy.mockRestore();
		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({ type: 'productAlias', value: mockValue }),
		);
	});
});
