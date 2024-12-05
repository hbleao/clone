import { describe, it, expect, vi } from 'vitest';
import { ValidationComposite } from './index';
import { FieldValidation } from '../../interface';

// Mock FieldValidation
const mockValidator = (field: string, error: string | null) => ({
  field,
  validate: vi.fn(() => (error ? new Error(error) : null)),
});

describe('ValidationComposite', () => {
  const fieldName = 'testField';

  it('should return an empty string if no validators fail', () => {
    const validators: FieldValidation[] = [
      mockValidator(fieldName, null),
      mockValidator(fieldName, null),
    ];
    const composite = ValidationComposite.build(validators);
    expect(composite.validate(fieldName, 'value')).toBe('');
  });

  it('should return the error message from the first failing validator', () => {
    const errorMessage = 'Validation error';
    const validators: FieldValidation[] = [
      mockValidator(fieldName, null),
      mockValidator(fieldName, errorMessage),
      mockValidator(fieldName, 'Another error'),
    ];
    const composite = ValidationComposite.build(validators);
    expect(composite.validate(fieldName, 'value')).toBe(errorMessage);
  });

  it('should not validate fields that do not match', () => {
    const validators: FieldValidation[] = [
      mockValidator('anotherField', 'Error'),
      mockValidator(fieldName, null),
    ];
    const composite = ValidationComposite.build(validators);
    expect(composite.validate(fieldName, 'value')).toBe('');
  });
});
