import { describe, it, expect } from 'vitest';
import { cpfMask } from './cpf';

describe('cpf.ts', () => {
  it('should format complete CPF correctly', () => {
    expect(cpfMask('12345678900')).toBe('123.456.789-00');
  });

  it('should handle partial CPF input', () => {
    expect(cpfMask('123')).toBe('123');
    expect(cpfMask('123456')).toBe('123.456');
    expect(cpfMask('123456789')).toBe('123.456.789');
  });

  it('should remove non-numeric characters', () => {
    expect(cpfMask('123.456.789-00')).toBe('123.456.789-00');
    expect(cpfMask('abc123def456ghi789jkl00')).toBe('123.456.789-00');
  });

  it('should handle empty string', () => {
    expect(cpfMask('')).toBe('');
  });
});
