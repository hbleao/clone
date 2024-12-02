import { describe, it, expect, vi } from 'vitest';
import { extractNumbers } from './extractNumbers';

describe('extractNumbers', () => {
	it('should return only numbers from a string with mixed characters', () => {
		const input = 'a1b2c3d4';
		const expected = '1234';

		const result = extractNumbers(input);

		expect(result).toBe(expected);
	});

	it('should return an empty string when input contains no numbers', () => {
		const input = 'abcdef';
		const expected = '';

		const result = extractNumbers(input);

		expect(result).toBe(expected);
	});

	it('should handle strings with spaces and special characters', () => {
		const input = '1 2-3.4,5';
		const expected = '12345';

		const result = extractNumbers(input);

		expect(result).toBe(expected);
	});

	it('should return the same string if it contains only numbers', () => {
		const input = '12345';
		const expected = '12345';

		const result = extractNumbers(input);

		expect(result).toBe(expected);
	});

	it('should return an empty string and log a warning for non-string input', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = extractNumbers(12345 as unknown as string);

		expect(result).toBe('');
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'Invalid input provided. Expected a string:',
			12345,
		);

		consoleWarnSpy.mockRestore();
	});

	it('should return an empty string for an empty input', () => {
		const input = '';
		const expected = '';

		const result = extractNumbers(input);

		expect(result).toBe(expected);
	});
});
