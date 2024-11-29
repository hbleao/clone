import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchScopeAndEligibility } from './fetchScopeAndEligibility';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('fetchScopeAndEligibility', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/abrangencia/elegibilidade`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return eligibility data when API responds successfully', async () => {
		const mockParam = {
			cep: '12345-678',
			partnerProductId: 'product123',
		};

		const mockData = {
			coverage: true,
			additionalNightValue: '50.00',
			additionalValue: '20.00',
			addressData: { street: 'Mock Street' },
			initialValue: '100.00',
			kmValue: '2.00',
			technicalVisitValue: '30.00',
		};

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchScopeAndEligibility(mockParam);

		expect(result).toEqual({
			...mockData,
			statusCode: 200,
		});

		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({
				partnerProductId: 'product123',
				postalCode: '12345678',
			}),
		);
	});

	it('should return default values when API responds with non-200 status', async () => {
		const mockParam = {
			cep: '12345-678',
			partnerProductId: 'product123',
		};

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 404,
			data: null,
		});

		const result = await fetchScopeAndEligibility(mockParam);

		expect(result).toEqual({
			statusCode: 404,
			coverage: false,
			additionalNightValue: '',
			additionalValue: '',
			addressData: {},
			initialValue: '',
			kmValue: '',
			technicalVisitValue: '',
		});

		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({
				partnerProductId: 'product123',
				postalCode: '12345678',
			}),
		);
	});

	it('should return default values and status 500 when API call fails', async () => {
		const mockParam = {
			cep: '12345-678',
			partnerProductId: 'product123',
		};

		const mockError = new Error('Network error');
		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const result = await fetchScopeAndEligibility(mockParam);

		expect(result).toEqual({
			statusCode: 500,
			coverage: false,
			additionalNightValue: '',
			additionalValue: '',
			addressData: {},
			initialValue: '',
			kmValue: '',
			technicalVisitValue: '',
		});

		expect(authorizedApi.post).toHaveBeenCalledWith(
			mockEndpoint,
			JSON.stringify({
				partnerProductId: 'product123',
				postalCode: '12345678',
			}),
		);
	});

	it('should log an error when API call fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockParam = {
			cep: '12345-678',
			partnerProductId: 'product123',
		};

		const mockError = new Error('Network error');
		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		await fetchScopeAndEligibility(mockParam);

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch scope and eligibility:', mockError);

		consoleErrorSpy.mockRestore();
	});
});
