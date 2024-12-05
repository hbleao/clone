import { BirthDateValidation } from './index';
import { CustomError } from '../../errors/CustomError';
import { describe, it, expect } from 'vitest';

describe('BirthDateValidation', () => {
  const field = 'birthDate';
  const errorMessage = 'Data de nascimento inválida';
  const validator = new BirthDateValidation(field, errorMessage);

  // Helper function to generate a date string in the format 'dd/MM/yyyy'
  function generateDateString(day: number, month: number, year: number): string {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  }

  it('should return null for valid birth date', () => {
    const validDate = generateDateString(1, 1, 2000);
    expect(validator.validate(validDate)).toBeNull();
  });

  it('should return error for future birth date', () => {
    const futureDate = generateDateString(1, 1, 3000);
    expect(validator.validate(futureDate)).toEqual(new CustomError(errorMessage));
  });

  it('should return error for birth date with invalid format', () => {
    const invalidFormatDate = '01-01-2000';
    expect(validator.validate(invalidFormatDate)).toEqual(new CustomError(errorMessage));
  });

  it('should return error for birth date under 18 years', () => {
    const underageDate = generateDateString(1, 1, new Date().getFullYear() - 17);
    expect(validator.validate(underageDate)).toEqual(new CustomError('Idade menor 18 ou maior que 80'));
  });

  it('should return error for birth date over 80 years', () => {
    const overageDate = generateDateString(1, 1, new Date().getFullYear() - 81);
    expect(validator.validate(overageDate)).toEqual(new CustomError('Idade menor 18 ou maior que 80'));
  });

  it('should return error for empty birth date', () => {
    expect(validator.validate('')).toEqual(new CustomError('Campo Obrigatório'));
  });
});
