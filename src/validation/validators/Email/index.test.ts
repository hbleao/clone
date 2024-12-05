import { describe, it, expect } from 'vitest';
import { EmailValidation } from './index';
import { CustomError } from '../../errors';

describe('EmailValidation', () => {
  const field = 'email';
  const errorMessage = 'Email inválido';
  const validator = new EmailValidation(field, errorMessage);

  it('should return null for a valid email', () => {
    const validEmail = 'test@example.com';
    expect(validator.validate(validEmail)).toBeNull();
  });

  it('should return error for an invalid email', () => {
    const invalidEmail = 'test@.com';
    expect(validator.validate(invalidEmail)).toEqual(new CustomError(errorMessage));
  });

  it('should return error for an empty email', () => {
    expect(validator.validate('')).toEqual(new CustomError(errorMessage));
  });

  it('should return error for an email without domain', () => {
    const invalidEmail = 'test@com';
    expect(validator.validate(invalidEmail)).toEqual(new CustomError(errorMessage));
  });

  it('should return error for an email without username', () => {
    const invalidEmail = '@example.com';
    expect(validator.validate(invalidEmail)).toEqual(new CustomError(errorMessage));
  });
});
