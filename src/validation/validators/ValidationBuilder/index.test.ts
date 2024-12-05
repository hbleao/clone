import { describe, it, expect } from 'vitest';
import { ValidationBuilder } from './index';
import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '..';


describe('ValidationBuilder', () => {
  const fieldName = 'testField';

  it('should create a ValidationBuilder instance with no validations', () => {
    const builder = ValidationBuilder.field(fieldName);
    expect(builder).toBeInstanceOf(ValidationBuilder);
  });

  it('should add a required field validation', () => {
    const builder = ValidationBuilder.field(fieldName).required();
    expect(builder['validations']).toHaveLength(1);
    expect(builder['validations'][0]).toBeInstanceOf(RequiredFieldValidation);
  });

  it('should add an email validation', () => {
    const builder = ValidationBuilder.field(fieldName).email();
    expect(builder['validations']).toHaveLength(1);
    expect(builder['validations'][0]).toBeInstanceOf(EmailValidation);
  });

  it('should add a min length validation', () => {
    const minLength = 5;
    const builder = ValidationBuilder.field(fieldName).min(minLength);
    expect(builder['validations']).toHaveLength(1);
    expect(builder['validations'][0]).toBeInstanceOf(MinLengthValidation);
  });

  it('should chain multiple validations', () => {
    const minLength = 5;
    const builder = ValidationBuilder.field(fieldName).required().email().min(minLength);
    expect(builder['validations']).toHaveLength(3);
    expect(builder['validations'][0]).toBeInstanceOf(RequiredFieldValidation);
    expect(builder['validations'][1]).toBeInstanceOf(EmailValidation);
    expect(builder['validations'][2]).toBeInstanceOf(MinLengthValidation);
  });
});
