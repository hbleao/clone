import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProposal } from './createProposal';
import { authorizedApi } from '@/lib';
import { GtmMeasurementProtocolService } from '../measurementProtocol';
import { getIp } from './getIp';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

vi.mock('../measurementProtocol', () => ({
	GtmMeasurementProtocolService: vi.fn(),
}));

vi.mock('./getIp', () => ({
	getIp: vi.fn().mockResolvedValue('127.0.0.1'),
}));

describe('createProposal', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/prestacao-servico/v1/proposta`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should create a proposal and send GTM event when API responds successfully', async () => {
		const mockParam = {
			serviceProvision: {
				serviceOrder: {
					requester: { documentNumber: '12345678900' },
				},
				products: [{ items: [{ id: 1 }] }],
			},
		};

		const mockResponse = {
			status: 200,
			data: { idLead: 'lead123' },
		};

		(authorizedApi.post as vi.Mock).mockResolvedValue(mockResponse);

		const result = await createProposal(mockParam);

		expect(result).toEqual({
			data: mockResponse.data,
			status: 200,
		});

		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, {
			scope: 'porto_service',
			...mockParam,
			ipAddress: '127.0.0.1',
		});

		expect(GtmMeasurementProtocolService).toHaveBeenCalledWith({
			documentNumber: '12345678900',
			leadId: 'lead123',
			products: [{ id: 1 }],
		});
	});

	it('should return an empty data object when API responds with non-200 status', async () => {
		const mockParam = { serviceProvision: {} };

		const mockResponse = {
			status: 400,
			data: null,
		};

		(authorizedApi.post as vi.Mock).mockResolvedValue(mockResponse);

		const result = await createProposal(mockParam);

		expect(result).toEqual({
			data: {},
			status: 400,
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, {
			scope: 'porto_service',
			...mockParam,
			ipAddress: '127.0.0.1',
		});
		expect(GtmMeasurementProtocolService).not.toHaveBeenCalled();
	});

	it('should return an empty data object and status 500 when API call fails', async () => {
		const mockParam = { serviceProvision: {} };
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const result = await createProposal(mockParam);

		expect(result).toEqual({
			data: {},
			status: 500,
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, {
			scope: 'porto_service',
			...mockParam,
			ipAddress: '127.0.0.1',
		});
		expect(GtmMeasurementProtocolService).not.toHaveBeenCalled();
	});

	it('should log an error when API call fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockParam = { serviceProvision: {} };
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		await createProposal(mockParam);

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create proposal:', mockError);

		consoleErrorSpy.mockRestore();
	});
});
