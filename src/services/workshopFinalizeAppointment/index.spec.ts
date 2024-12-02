import { describe, it, expect, vi, beforeEach } from 'vitest';
import { finalizeWorkshopAppointment } from './finalizeWorkshopAppointment';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('finalizeWorkshopAppointment', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/hub-vendas-carbon/aquisicao/v1/caps/email`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return true when the appointment is finalized successfully', async () => {
		const mockAppointment = { id: 1, details: 'Mock appointment details' };

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: {},
		});

		const result = await finalizeWorkshopAppointment(mockAppointment);

		expect(result).toBe(true);
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockAppointment);
	});

	it('should throw an error when API responds with non-200 status', async () => {
		const mockAppointment = { id: 1, details: 'Mock appointment details' };

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 400,
			data: { message: 'Invalid appointment data' },
		});

		await expect(finalizeWorkshopAppointment(mockAppointment)).rejects.toThrow(
			'API Error 400: Invalid appointment data',
		);

		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockAppointment);
	});

	it('should throw an error and log it when API call fails', async () => {
		const mockAppointment = { id: 1, details: 'Mock appointment details' };
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await expect(finalizeWorkshopAppointment(mockAppointment)).rejects.toThrow(
			'Network error',
		);

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error finalizing workshop appointment:',
			mockError,
		);

		consoleErrorSpy.mockRestore();
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockAppointment);
	});
});
