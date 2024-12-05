import { describe, it, expect, vi } from 'vitest';
import { CpfOrCnpjValidation } from './index';
import { CustomError } from '../../errors';

// Mock CPF and CNPJ validators
import { CPFValidation } from '../CPF';
import { CnpjValidation } from '../CNPJ';

vi.mock('../CPF', () => ({
  CPFValidation: vi.fn().mockImplementation(() => ({
    validate: vi.fn((value) => (value === 'validCPF' ? null : new CustomError('CPF com valor inválido'))),
  })),
}));

vi.mock('../CNPJ', () => ({
  CnpjValidation: vi.fn().mockImplementation(() => ({
    validate: vi.fn((value) => (value === 'validCNPJ' ? null : new CustomError('CNPJ com valor inválido'))),
  })),
}));

describe('CpfOrCnpjValidation', () => {
  const field = 'cpfOrCnpj';
  const errorMessage = 'Documento inválido';
  const validator = new CpfOrCnpjValidation(field, errorMessage);

  it('should return null for a valid CPF', () => {
    expect(validator.validate('validCPF')).toBeNull();
  });

  it('should return error for an invalid CPF', () => {
    expect(validator.validate('invalidCPF')).toEqual(new CustomError('CPF com valor inválido'));
  });

  it('should return null for a valid CNPJ', () => {
    expect(validator.validate('validCNPJ')).toBeNull();
  });

  it('should return error for an invalid CNPJ', () => {
    expect(validator.validate('invalidCNPJ')).toEqual(new CustomError('CNPJ com valor inválido'));
  });

  it('should return null for an empty value', () => {
    expect(validator.validate('')).toBeNull();
  });
});
