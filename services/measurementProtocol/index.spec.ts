import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEventToGtmMeasurementProtocol } from './sendEventToGtmMeasurementProtocol';
import { encryptValue } from '@/utils';
import { removeSpecialCharacters } from '@/validation/helpers';
import { cookies } from 'next/headers';

vi.mock('@/utils', () => ({
	encryptValue: vi.fn((val) => `encrypted-${val}`),
}));

vi.mock('@/validation/helpers', () => ({
	removeSpecialCharacters: vi.fn((val) => val.replace(/[^a-zA-Z0-9]/g, '')),
}));

vi.mock('next/headers', () => ({
	cookies: vi.fn(() => ({
		get: vi.fn((key) => {
			if (key === '_ga') return { value: 'GA1.1.12345.67890' };
			if (key === '_ga_mockMeasurementID') return { value: 'GA1.1.123.456.789' };
			return null;
		}),
	})),
}));

vi.mock('node-fetch', () => ({
	default: vi.fn(),
}));

import fetch from 'node-fetch';
const { Response } = fetch;

describe('sendEventToGtmMeasurementProtocol', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should send event and return "ok" on success', async () => {
		(fetch as vi.Mock).mockResolvedValue(
			new Response('Success', { status: 200 }),
		);

		const result = await sendEventToGtmMeasurementProtocol({
			leadId: 'lead123',
			products: [{ category: 'MockCategory' }],
			documentNumber: '123456789',
		});

		expect(result).toBe('ok');
		expect(fetch).toHaveBeenCalled();
	});

	it('should return null and log an error if the API response is not ok', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		(fetch as vi.Mock).mockResolvedValue(
			new Response('Error', { status: 500 }),
		);

		const result = await sendEventToGtmMeasurementProtocol({
			leadId: 'lead123',
			products: [{ category: 'MockCategory' }],
			documentNumber: '123456789',
		});

		expect(result).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});

	it('should return null and log an error if the request fails', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		(fetch as vi.Mock).mockRejectedValue(new Error('Network Error'));

		const result = await sendEventToGtmMeasurementProtocol({
			leadId: 'lead123',
			products: [{ category: 'MockCategory' }],
			documentNumber: '123456789',
		});

		expect(result).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});
