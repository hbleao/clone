import { describe, it, expect } from 'vitest';
import { RequiredFieldValidation } from './index';
import { RequiredFieldError } from '../../errors';

describe('RequiredFieldValidation', () => {
  const field = 'testField';
  const validator = new RequiredFieldValidation(field);

  it('should return null for a non-empty value', () => {
    const validValue = 'some value';
    expect(validator.validate(validValue)).toBeNull();
  });

  it('should return error for an empty value', () => {
    expect(validator.validate('')).toEqual(new RequiredFieldError());
  });

  it('should return error for a null value', () => {
    expect(validator.validate(null as unknown as string)).toEqual(new RequiredFieldError());
  });

  it('should return error for an undefined value', () => {
    expect(validator.validate(undefined as unknown as string)).toEqual(new RequiredFieldError());
  });
});
