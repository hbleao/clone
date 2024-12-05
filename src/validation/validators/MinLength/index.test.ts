import { describe, it, expect } from 'vitest';
import { MinLengthValidation } from './index';
import { CustomError } from '../../errors';

describe('MinLengthValidation', () => {
  const field = 'testField';
  const errorMessage = 'Valor abaixo do comprimento mínimo';
  const minLength = 5;
  const validator = new MinLengthValidation(field, errorMessage, minLength);

  it('should return null for a string above min length', () => {
    const validValue = '123456';
    expect(validator.validate(validValue)).toBeNull();
  });

  it('should return error for a string below min length', () => {
    const invalidValue = '1234';
    expect(validator.validate(invalidValue)).toEqual(new CustomError(errorMessage));
  });

  it('should return null for a string with exact min length', () => {
    const validValue = '12345';
    expect(validator.validate(validValue)).toBeNull();
  });

  it('should handle undefined minLength gracefully', () => {
    const validatorWithUndefinedMin = new MinLengthValidation(field, errorMessage);
    expect(validatorWithUndefinedMin.validate('')).toBeNull();
    expect(validatorWithUndefinedMin.validate('1234')).toEqual(new CustomError(errorMessage));
  });
});
