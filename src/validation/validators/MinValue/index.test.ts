import { describe, it, expect } from 'vitest';
import { MinValueValidation } from './index';
import { CustomError } from '../../errors';

describe('MinValueValidation', () => {
  const field = 'testField';
  const errorMessage = 'Valor abaixo do mínimo permitido';
  const minValue = 10;
  const validator = new MinValueValidation(field, errorMessage, minValue);

  it('should return null for a value above min value', () => {
    const validValue = '15';
    expect(validator.validate(validValue)).toBeNull();
  });

  it('should return error for a value below min value', () => {
    const invalidValue = '5';
    expect(validator.validate(invalidValue)).toEqual(new CustomError(errorMessage));
  });

  it('should return null for a value equal to min value', () => {
    const validValue = '10';
    expect(validator.validate(validValue)).toBeNull();
  });

  it('should return error for a non-numeric value', () => {
    const invalidValue = 'abc';
    expect(validator.validate(invalidValue)).toEqual(new CustomError(errorMessage));
  });

  it('should handle undefined minValue gracefully', () => {
    const validatorWithUndefinedMin = new MinValueValidation(field, errorMessage);
    expect(validatorWithUndefinedMin.validate('5')).toEqual(new CustomError(errorMessage));
    expect(validatorWithUndefinedMin.validate('15')).toBeNull();
  });
});
