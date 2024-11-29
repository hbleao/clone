import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getClientIp } from './getClientIp';
import { headers } from 'next/headers';

vi.mock('next/headers', () => ({
	headers: vi.fn(),
}));

describe('getClientIp', () => {
	const mockHeaders = {
		get: vi.fn(),
	};

	beforeEach(() => {
		vi.resetAllMocks();
		(headers as vi.Mock).mockReturnValue(mockHeaders);
	});

	it('should return the first IP from x-forwarded-for header', async () => {
		mockHeaders.get.mockImplementation((key) => {
			if (key === 'x-forwarded-for') return '192.168.0.1, 192.168.0.2';
			return null;
		});

		const result = await getClientIp();

		expect(result).toBe('192.168.0.1');
		expect(mockHeaders.get).toHaveBeenCalledWith('x-forwarded-for');
	});

	it('should return x-real-ip when x-forwarded-for is not present', async () => {
		mockHeaders.get.mockImplementation((key) => {
			if (key === 'x-real-ip') return '192.168.1.1';
			return null;
		});

		const result = await getClientIp();

		expect(result).toBe('192.168.1.1');
		expect(mockHeaders.get).toHaveBeenCalledWith('x-real-ip');
	});

	it('should return the default IP address when no headers are available', async () => {
		mockHeaders.get.mockReturnValue(null);

		const result = await getClientIp();

		expect(result).toBe('127.0.0.1');
		expect(mockHeaders.get).toHaveBeenCalledWith('x-forwarded-for');
		expect(mockHeaders.get).toHaveBeenCalledWith('x-real-ip');
	});

	it('should trim whitespace from x-forwarded-for IPs', async () => {
		mockHeaders.get.mockImplementation((key) => {
			if (key === 'x-forwarded-for') return ' 192.168.0.1 , 192.168.0.2 ';
			return null;
		});

		const result = await getClientIp();

		expect(result).toBe('192.168.0.1');
		expect(mockHeaders.get).toHaveBeenCalledWith('x-forwarded-for');
	});

	it('should remove ::1 from x-forwarded-for if present', async () => {
		mockHeaders.get.mockImplementation((key) => {
			if (key === 'x-forwarded-for') return '::1, 192.168.0.1';
			return null;
		});

		const result = await getClientIp();

		expect(result).toBe('192.168.0.1');
		expect(mockHeaders.get).toHaveBeenCalledWith('x-forwarded-for');
	});
});
