import { describe, it, expect } from 'vitest';
import { applyCnpjMask } from './applyCnpjMask';

describe('applyCnpjMask', () => {
	it('should format a valid CNPJ string correctly', () => {
		const input = '12345678000195';
		const expected = '12.345.678/0001-95';

		const result = applyCnpjMask(input);

		expect(result).toBe(expected);
	});

	it('should handle CNPJ strings with non-numeric characters', () => {
		const input = '12.345/678.0001-95';
		const expected = '12.345.678/0001-95';

		const result = applyCnpjMask(input);

		expect(result).toBe(expected);
	});

	it('should truncate CNPJ strings longer than 14 digits', () => {
		const input = '12345678000195123';
		const expected = '12.345.678/0001-95';

		const result = applyCnpjMask(input);

		expect(result).toBe(expected);
	});

	it('should return the partially formatted CNPJ for short strings', () => {
		const input = '1234567';
		const expected = '12.345.67';

		const result = applyCnpjMask(input);

		expect(result).toBe(expected);
	});

	it('should return an empty string for an empty input', () => {
		const input = '';
		const expected = '';

		const result = applyCnpjMask(input);

		expect(result).toBe(expected);
	});
});
