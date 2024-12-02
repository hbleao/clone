import { describe, it, expect, vi } from 'vitest';
import { sanitize } from './sanitize';
import sanitizeHtml from 'sanitize-html';

vi.mock('sanitize-html', () => ({
	default: vi.fn((value) => value), // Simula comportamento básico de sanitize-html
}));

describe('sanitize', () => {
	it('should sanitize a string by removing special characters and sanitizing HTML', () => {
		const input = 'Hello <b>World!</b> @#%!';
		const expected = 'Hello World';

		const result = sanitize(input);

		expect(result).toBe(expected);
	});

	it('should handle strings without special characters or HTML', () => {
		const input = 'Plain text';
		const expected = 'Plain text';

		const result = sanitize(input);

		expect(result).toBe(expected);
	});

	it('should return an empty string and log a warning for non-string inputs', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = sanitize(null as unknown as string);

		expect(result).toBe('');
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'Invalid input provided for sanitization:',
			null,
		);

		consoleWarnSpy.mockRestore();
	});

	it('should remove only special characters and keep spaces and alphanumeric characters', () => {
		const input = 'Special characters: !@#$%^&*()';
		const expected = 'Special characters ';

		const result = sanitize(input);

		expect(result).toBe(expected);
	});

	it('should call sanitize-html with the processed string', () => {
		const input = 'Test <script>alert("xss")</script>';
		const sanitizedInput = 'Test alertxss';

		sanitize(input);

		expect(sanitizeHtml).toHaveBeenCalledWith(sanitizedInput);
	});
});
