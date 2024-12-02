import { describe, it, expect } from 'vitest';
import { applyPhoneMask } from './applyPhoneMask';

describe('applyPhoneMask', () => {
	it('should format a valid phone number with 10 digits', () => {
		const input = '1123456789';
		const expected = '(11) 2345-6789';

		const result = applyPhoneMask(input);

		expect(result).toBe(expected);
	});

	it('should format a valid phone number with 11 digits', () => {
		const input = '11923456789';
		const expected = '(11) 92345-6789';

		const result = applyPhoneMask(input);

		expect(result).toBe(expected);
	});

	it('should handle non-numeric characters and format the phone number', () => {
		const input = '(11) 92345-6789';
		const expected = '(11) 92345-6789';

		const result = applyPhoneMask(input);

		expect(result).toBe(expected);
	});

	it('should truncate numbers longer than 11 digits', () => {
		const input = '11923456789123';
		const expected = '(11) 92345-6789';

		const result = applyPhoneMask(input);

		expect(result).toBe(expected);
	});

	it('should return an empty string for an empty input', () => {
		const input = '';
		const expected = '';

		const result = applyPhoneMask(input);

		expect(result).toBe(expected);
	});

	it('should handle inputs with fewer than 10 digits', () => {
		const input = '11234';
		const expected = '11234';

		const result = applyPhoneMask(input);

		expect(result).toBe(expected);
	});
});
