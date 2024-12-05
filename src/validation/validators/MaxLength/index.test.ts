import { describe, it, expect } from 'vitest';
import { MaxLengthValidation } from './index';
import { CustomError } from '../../errors';

describe('MaxLengthValidation', () => {
  const field = 'testField';
  const errorMessage = 'Valor excede o comprimento máximo';
  const maxLength = 5;
  const validator = new MaxLengthValidation(field, errorMessage, maxLength);

  it('should return null for a string within max length', () => {
    const validValue = '12345';
    expect(validator.validate(validValue)).toBeNull();
  });

  it('should return error for a string exceeding max length', () => {
    const invalidValue = '123456';
    expect(validator.validate(invalidValue)).toEqual(new CustomError(errorMessage));
  });

  it('should return null for an empty string', () => {
    expect(validator.validate('')).toBeNull();
  });

  it('should handle undefined maxLength gracefully', () => {
    const validatorWithUndefinedMax = new MaxLengthValidation(field, errorMessage);
    expect(validatorWithUndefinedMax.validate('')).toBeNull();
    expect(validatorWithUndefinedMax.validate('123456')).toEqual(new CustomError(errorMessage));
  });
});
