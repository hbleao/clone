import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchScheduleAvailability } from './fetchScheduleAvailability';
import { authorizedApi } from '@/lib';

vi.mock('@/lib', () => ({
	authorizedApi: {
		post: vi.fn(),
	},
}));

describe('fetchScheduleAvailability', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/agendamento/disponibilidade`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return schedule data when API responds successfully', async () => {
		const mockBody = { serviceId: 123 };
		const mockData = {
			selectedHour: '10:00',
			selectedDate: { day: '2024-01-01' },
			availableDays: ['2024-01-01', '2024-01-02'],
		};

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockData,
		});

		const result = await fetchScheduleAvailability(mockBody);

		expect(result).toEqual({
			data: mockData,
			status: 200,
			selectedHour: '10:00',
			selectedDate: { day: '2024-01-01' },
			availableDays: ['2024-01-01', '2024-01-02'],
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockBody);
	});

	it('should return a default object when API responds with non-200 status', async () => {
		const mockBody = { serviceId: 123 };

		(authorizedApi.post as vi.Mock).mockResolvedValue({
			status: 404,
			data: null,
		});

		const result = await fetchScheduleAvailability(mockBody);

		expect(result).toEqual({
			data: {},
			status: 404,
			selectedHour: '',
			selectedDate: {},
			availableDays: [],
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockBody);
	});

	it('should return a default object and status 500 when API call fails', async () => {
		const mockBody = { serviceId: 123 };
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		const result = await fetchScheduleAvailability(mockBody);

		expect(result).toEqual({
			data: {},
			status: 500,
			selectedHour: '',
			selectedDate: {},
			availableDays: [],
		});
		expect(authorizedApi.post).toHaveBeenCalledWith(mockEndpoint, mockBody);
	});

	it('should log an error when API call fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const mockBody = { serviceId: 123 };
		const mockError = new Error('Network error');

		(authorizedApi.post as vi.Mock).mockRejectedValue(mockError);

		await fetchScheduleAvailability(mockBody);

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch schedule availability:', mockError);

		consoleErrorSpy.mockRestore();
	});
});
