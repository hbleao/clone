import { describe, it, expect } from 'vitest';
import { applyCepMask } from './applyCepMask';

describe('applyCepMask', () => {
	it('should format a valid CEP string correctly', () => {
		const input = '12345678';
		const expected = '12345-678';

		const result = applyCepMask(input);

		expect(result).toBe(expected);
	});

	it('should handle CEP strings with non-numeric characters', () => {
		const input = '12.345-678';
		const expected = '12345-678';

		const result = applyCepMask(input);

		expect(result).toBe(expected);
	});

	it('should truncate CEP strings longer than 8 digits', () => {
		const input = '1234567890';
		const expected = '12345-678';

		const result = applyCepMask(input);

		expect(result).toBe(expected);
	});

	it('should return the partially formatted CEP for short strings', () => {
		const input = '12345';
		const expected = '12345';

		const result = applyCepMask(input);

		expect(result).toBe(expected);
	});

	it('should return an empty string for an empty input', () => {
		const input = '';
		const expected = '';

		const result = applyCepMask(input);

		expect(result).toBe(expected);
	});
});
