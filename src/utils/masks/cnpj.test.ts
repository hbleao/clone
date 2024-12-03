import { describe, it, expect } from 'vitest';
import { cnpjMask } from './cnpj';

describe('cnpjMask', () => {
  it('should format complete CNPJ correctly', () => {
    expect(cnpjMask('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('should handle partial CNPJ input', () => {
    expect(cnpjMask('123')).toBe('12.3');
    expect(cnpjMask('123456')).toBe('12.345.6');
    expect(cnpjMask('12345678')).toBe('12.345.678');
  });

  it('should remove non-numeric characters', () => {
    expect(cnpjMask('12.345.678/0001-99')).toBe('12.345.678/0001-99');
    expect(cnpjMask('abc12def345ghi678jkl0001mn99')).toBe('12.345.678/0001-99');
  });

  it('should handle empty string', () => {
    expect(cnpjMask('')).toBe('');
  });
});
