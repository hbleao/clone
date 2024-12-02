import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWorkshopsByLatLng } from './fetchWorkshopsByLatLng';

global.fetch = vi.fn();

describe('fetchWorkshopsByLatLng', () => {
	const mockBaseUrl = 'https://mock-api-base-url.com';
	const mockEndpoint = `${mockBaseUrl}/api/caps/workshops`;

	beforeEach(() => {
		vi.resetAllMocks();
		process.env.NEXT_PUBLIC_API_NEXT_BASE_URL = mockBaseUrl; // Mockando variável de ambiente
	});

	it('should return workshops when API responds successfully', async () => {
		const mockLat = '10.123';
		const mockLng = '-20.456';
		const mockData = [
			{ id: 1, name: 'Workshop A', location: 'Location A' },
			{ id: 2, name: 'Workshop B', location: 'Location B' },
		];

		(global.fetch as vi.Mock).mockResolvedValue({
			ok: true,
			status: 200,
			json: vi.fn().mockResolvedValue(mockData),
		});

		const result = await fetchWorkshopsByLatLng(mockLat, mockLng);

		expect(result).toEqual(mockData);
		expect(global.fetch).toHaveBeenCalledWith(
			`${mockEndpoint}?lat=${mockLat}&lng=${mockLng}`,
		);
	});

	it('should return an empty list when API responds with non-200 status', async () => {
		const mockLat = '10.123';
		const mockLng = '-20.456';

		(global.fetch as vi.Mock).mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found',
		});

		const result = await fetchWorkshopsByLatLng(mockLat, mockLng);

		expect(result).toEqual([]);
		expect(global.fetch).toHaveBeenCalledWith(
			`${mockEndpoint}?lat=${mockLat}&lng=${mockLng}`,
		);
	});

	it('should return an empty list and log an error when API call fails', async () => {
		const mockLat = '10.123';
		const mockLng = '-20.456';
		const mockError = new Error('Network error');

		(global.fetch as vi.Mock).mockRejectedValue(mockError);

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = await fetchWorkshopsByLatLng(mockLat, mockLng);

		expect(result).toEqual([]);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error fetching workshops:',
			mockError,
		);

		consoleErrorSpy.mockRestore();
		expect(global.fetch).toHaveBeenCalledWith(
			`${mockEndpoint}?lat=${mockLat}&lng=${mockLng}`,
		);
	});
});
