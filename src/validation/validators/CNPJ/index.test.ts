import { describe, expect, it, vi } from 'vitest';
import { CustomError } from '../../errors';
import { CnpjValidation } from './index';

// Mock helper functions
import { isRepeatedNumbers } from '../../helpers';

vi.mock('../../helpers', () => ({
	extractCheckDigits: vi.fn(() => '12'),
	isRepeatedNumbers: vi.fn(() => false),
	isValidLength: vi.fn(() => true),
}));

describe('CnpjValidation', () => {
	const field = 'cnpj';
	const errorMessage = 'CNPJ inválido';
	const validator = new CnpjValidation(field, errorMessage);

	it('should return null for a valid CNPJ', () => {
		const validCnpj = '12345678000195';
		expect(validator.validate(validCnpj)).toBeNull();
	});

	it('should return error for an invalid CNPJ', () => {
		const invalidCnpj = '12345678000194';
		expect(validator.validate(invalidCnpj)).toEqual(
			new CustomError(errorMessage),
		);
	});

	it('should return error for a CNPJ with repeated numbers', () => {
		isRepeatedNumbers.mockReturnValueOnce(true);
		const repeatedCnpj = '11111111111111';
		expect(validator.validate(repeatedCnpj)).toEqual(
			new CustomError(errorMessage),
		);
	});

	it('should return error for an empty CNPJ', () => {
		expect(validator.validate('')).toEqual(new CustomError(errorMessage));
	});
});
