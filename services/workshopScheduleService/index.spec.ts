import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWorkshopSchedule } from './fetchWorkshopSchedule';

global.fetch = vi.fn();

describe('fetchWorkshopSchedule', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/api/caps/workshop`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_API_NEXT_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return available dates when API responds successfully', async () => {
		const mockCode = 'workshop123';
		const mockData = [
			{ date: '2024-01-01', timeSlots: ['10:00', '14:00'] },
			{ date: '2024-01-02', timeSlots: ['09:00', '13:00'] },
		];

		(global.fetch as vi.Mock).mockResolvedValue({
			ok: true,
			status: 200,
			json: vi.fn().mockResolvedValue(mockData),
		});

		const result = await fetchWorkshopSchedule({ code: mockCode });

		expect(result).toEqual(mockData);
		expect(global.fetch).toHaveBeenCalledWith(`${mockEndpoint}/${mockCode}/schedule`);
	});

	it('should throw an error when API responds with non-200 status', async () => {
		const mockCode = 'workshop123';

		(global.fetch as vi.Mock).mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found',
		});

		await expect(fetchWorkshopSchedule({ code: mockCode })).rejects.toThrow(
			'Failed to fetch workshop schedule for code [workshop123]: 404 Not Found',
		);

		expect(global.fetch).toHaveBeenCalledWith(`${mockEndpoint}/${mockCode}/schedule`);
	});

	it('should log and throw an error when API call fails', async () => {
		const mockCode = 'workshop123';
		const mockError = new Error('Network error');

		(global.fetch as vi.Mock).mockRejectedValue(mockError);

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await expect(fetchWorkshopSchedule({ code: mockCode })).rejects.toThrow(
			'Network error',
		);

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error fetching workshop schedule:',
			mockError,
		);

		consoleErrorSpy.mockRestore();
		expect(global.fetch).toHaveBeenCalledWith(`${mockEndpoint}/${mockCode}/schedule`);
	});
});
