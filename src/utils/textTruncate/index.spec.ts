import { describe, it, expect, vi } from 'vitest';
import { truncateText } from './truncateText';

describe('truncateText', () => {
	it('should return the original text if its length is less than or equal to the specified length', () => {
		const text = 'Short text';
		const length = 20;

		const result = truncateText(text, length);

		expect(result).toBe(text);
	});

	it('should truncate the text and append "..." if its length exceeds the specified length', () => {
		const text = 'This is a very long text that needs truncation.';
		const length = 10;

		const result = truncateText(text, length);

		expect(result).toBe('This is a ...');
	});

	it('should return undefined and log a warning if the text is not provided', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = truncateText(undefined as unknown as string, 10);

		expect(result).toBeUndefined();
		expect(consoleWarnSpy).toHaveBeenCalledWith('No text provided for truncation.');

		consoleWarnSpy.mockRestore();
	});

	it('should handle empty strings correctly', () => {
		const result = truncateText('', 10);

		expect(result).toBe('');
	});

	it('should handle length of 0 by returning "..." for non-empty text', () => {
		const text = 'Sample text';
		const length = 0;

		const result = truncateText(text, length);

		expect(result).toBe('...');
	});
});
