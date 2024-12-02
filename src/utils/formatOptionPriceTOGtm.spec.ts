import { describe, it, expect, vi } from 'vitest';
import { formatPriceForGtm } from './formatPriceForGtm';
import { formattedPrice } from '@/utils';

vi.mock('@/utils', () => ({
	formattedPrice: vi.fn(),
}));

describe('formatPriceForGtm', () => {
	it('should format a valid price correctly', () => {
		(formattedPrice as vi.Mock).mockReturnValue('R$ 1.234,56');

		const result = formatPriceForGtm(1234.56);

		expect(result).toBe('1.234,56');
		expect(formattedPrice).toHaveBeenCalledWith(1234.56);
	});

	it('should return an empty string and log an error for invalid input (non-numeric)', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = formatPriceForGtm('invalid' as unknown as number);

		expect(result).toBe('');
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Invalid value provided for formatting:',
			'invalid',
		);

		consoleErrorSpy.mockRestore();
	});

	it('should return an empty string and log an error for NaN', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = formatPriceForGtm(NaN);

		expect(result).toBe('');
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Invalid value provided for formatting:',
			NaN,
		);

		consoleErrorSpy.mockRestore();
	});

	it('should remove spaces and "R$" from the formatted price', () => {
		(formattedPrice as vi.Mock).mockReturnValue('R$ 1 234,56');

		const result = formatPriceForGtm(1234.56);

		expect(result).toBe('1234,56');
		expect(formattedPrice).toHaveBeenCalledWith(1234.56);
	});
});
