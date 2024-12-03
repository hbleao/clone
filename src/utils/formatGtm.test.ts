import { describe, expect, it } from 'vitest';
import { formatGtm } from './formatGtm';

describe('formatGtm.ts', () => {
	describe('string input', () => {
		it('should handle undefined input', () => {
			expect(formatGtm(undefined)).toBeUndefined();
		});

		it('should handle empty string', () => {
			expect(formatGtm('')).toBe('');
			expect(formatGtm('   ')).toBe('');
		});

		it('should format string with spaces', () => {
			expect(formatGtm('Test String')).toBe('test-string');
		});

		it('should format string with special characters', () => {
			expect(formatGtm('Test@String!')).toBe('test-string');
		});

		it('should format string with multiple spaces', () => {
			expect(formatGtm('  Test   String  ')).toBe('test-string');
		});

		it('should format string with accents', () => {
			expect(formatGtm('Tést Strîng')).toBe('test-string');
		});
	});

	describe('object input', () => {
		it('should handle empty object', () => {
			expect(formatGtm({})).toEqual({});
		});

		it('should format object with string values', () => {
			const input = {
				testKey: 'Test String',
				anotherKey: 'Another Test',
			};
			const expected = {
				testKey: 'test-string',
				anotherKey: 'another-test',
			};
			expect(formatGtm(input)).toEqual(expected);
		});

		it('should handle nested objects', () => {
			const input = {
				testKey: 'Test String',
				nested: {
					innerKey: 'Inner Test',
				},
			};
			const expected = {
				testKey: 'test-string',
				nested: {
					innerKey: 'inner-test',
				},
			};
			expect(formatGtm(input)).toEqual(expected);
		});

		it('should handle arrays in objects', () => {
			const input = {
				testKey: 'Test String',
				array: ['Test One', 'Test Two'],
			};
			const expected = {
				testKey: 'test-string',
				array: ['test-one', 'test-two'],
			};
			expect(formatGtm(input)).toEqual(expected);
		});

		it('should preserve non-string values', () => {
			const input = {
				testKey: 'Test String',
				number: 123,
				boolean: true,
				null: null,
			};
			const expected = {
				testKey: 'test-string',
				number: 123,
				boolean: true,
				null: null,
			};
			expect(formatGtm(input)).toEqual(expected);
		});
	});
});
