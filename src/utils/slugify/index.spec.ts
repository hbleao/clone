import { describe, it, expect, vi } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
	it('should convert a string to a valid slug', () => {
		const text = 'Hello World! This is a Test.';
		const expectedSlug = 'hello-world-this-is-a-test';

		const result = slugify(text);

		expect(result).toBe(expectedSlug);
	});

	it('should handle strings with multiple spaces', () => {
		const text = 'Hello     World';
		const expectedSlug = 'hello-world';

		const result = slugify(text);

		expect(result).toBe(expectedSlug);
	});

	it('should remove special characters', () => {
		const text = 'Hello @ World! #Slugify';
		const expectedSlug = 'hello-world-slugify';

		const result = slugify(text);

		expect(result).toBe(expectedSlug);
	});

	it('should remove leading and trailing hyphens', () => {
		const text = '---Hello World---';
		const expectedSlug = 'hello-world';

		const result = slugify(text);

		expect(result).toBe(expectedSlug);
	});

	it('should handle empty strings gracefully', () => {
		const result = slugify('');

		expect(result).toBe('');
	});

	it('should handle undefined input and log a warning', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = slugify(undefined as unknown as string);

		expect(result).toBe('');
		expect(consoleWarnSpy).toHaveBeenCalledWith('No text provided for slugify.');

		consoleWarnSpy.mockRestore();
	});
});
