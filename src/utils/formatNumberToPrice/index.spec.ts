import { describe, it, expect, vi } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
	it('should format a valid number as a price in Brazilian currency', () => {
		const input = 1234.56;
		const expected = 'R$ 1.234,56';

		const result = formatPrice(input);

		expect(result).toBe(expected);
	});

	it('should return the value itself for invalid inputs (non-number)', () => {
		const input = 'invalid' as unknown as number;

		const result = formatPrice(input);

		expect(result).toBe(input);
	});

	it('should return the value itself for NaN', () => {
		const input = NaN;

		const result = formatPrice(input);

		expect(result).toBe(input);
	});

	it('should return "R$ 0,00" for a valid zero value', () => {
		const input = 0;
		const expected = 'R$ 0,00';

		const result = formatPrice(input);

		expect(result).toBe(expected);
	});

	it('should log a warning for invalid inputs', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const input = 'invalid' as unknown as number;

		formatPrice(input);

		expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid value provided for formatting:', input);

		consoleWarnSpy.mockRestore();
	});
});
