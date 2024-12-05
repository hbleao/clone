import { describe, it, expect, vi } from 'vitest';
import { CPFValidation } from './index';
import { CustomError } from '../../errors';

// Mock helper functions
import { extractCheckDigits, isRepeatedNumbers, isValidLength } from '../../helpers';

vi.mock('../../helpers', () => ({
  extractCheckDigits: vi.fn(() => '12'),
  isRepeatedNumbers: vi.fn(() => false),
  isValidLength: vi.fn(() => true),
}));

describe('CPFValidation', () => {
  const field = 'cpf';
  const errorMessage = 'CPF inválido';
  const validator = new CPFValidation(field, errorMessage);

  it('should return null for a valid CPF', () => {
    const validCpf = '12345678909';
    expect(validator.validate(validCpf)).toBeNull();
  });

  it('should return error for an invalid CPF', () => {
    const invalidCpf = '12345678908';
    expect(validator.validate(invalidCpf)).toEqual(new CustomError(errorMessage));
  });

  it('should return error for a CPF with repeated numbers', () => {
    isRepeatedNumbers.mockReturnValueOnce(true);
    const repeatedCpf = '11111111111';
    expect(validator.validate(repeatedCpf)).toEqual(new CustomError(errorMessage));
  });

  it('should return error for an empty CPF', () => {
    expect(validator.validate('')).toEqual(new CustomError(errorMessage));
  });
});
