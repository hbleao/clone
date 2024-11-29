import { describe, it, expect, vi } from 'vitest';
import { formatAemImageUrl } from './formatAemImageUrl';

describe('formatAemImageUrl', () => {
	it('should format a valid URL correctly', () => {
		const partialUrl = 'images/sample.jpg';
		const expectedUrl = 'https://www.portoseguro.com.br/images/sample.jpg';

		const result = formatAemImageUrl(partialUrl);

		expect(result).toBe(expectedUrl);
	});

	it('should return an empty string and log an error for a non-string URL', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = formatAemImageUrl(123 as unknown as string);

		expect(result).toBe('');
		expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid URL provided for formatting:', 123);

		consoleErrorSpy.mockRestore();
	});

	it('should return an empty string and log an error for an empty URL', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = formatAemImageUrl('');

		expect(result).toBe('');
		expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid URL provided for formatting:', '');

		consoleErrorSpy.mockRestore();
	});

	it('should return an empty string and log an error for a null URL', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = formatAemImageUrl(null as unknown as string);

		expect(result).toBe('');
		expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid URL provided for formatting:', null);

		consoleErrorSpy.mockRestore();
	});
});
