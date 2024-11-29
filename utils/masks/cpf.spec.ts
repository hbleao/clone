import { describe, it, expect } from 'vitest';
import { applyCpfMask } from './applyCpfMask';

describe('applyCpfMask', () => {
	it('should format a valid CPF string correctly', () => {
		const input = '12345678909';
		const expected = '123.456.789-09';

		const result = applyCpfMask(input);

		expect(result).toBe(expected);
	});

	it('should handle CPF strings with non-numeric characters', () => {
		const input = '123.456/789-09';
		const expected = '123.456.789-09';

		const result = applyCpfMask(input);

		expect(result).toBe(expected);
	});

	it('should truncate CPF strings longer than 11 digits', () => {
		const input = '12345678909123';
		const expected = '123.456.789-09';

		const result = applyCpfMask(input);

		expect(result).toBe(expected);
	});

	it('should return the partially formatted CPF for short strings', () => {
		const input = '12345';
		const expected = '123.45';

		const result = applyCpfMask(input);

		expect(result).toBe(expected);
	});

	it('should return an empty string for an empty input', () => {
		const input = '';
		const expected = '';

		const result = applyCpfMask(input);

		expect(result).toBe(expected);
	});
});
