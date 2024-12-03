import { describe, it, expect } from 'vitest';
import { cepMask } from './cep';

describe('cepMask', () => {
  it('should format complete CEP correctly', () => {
    expect(cepMask('12345678')).toBe('12345-678');
  });

  it('should handle partial CEP input', () => {
    expect(cepMask('123')).toBe('123');
    expect(cepMask('12345')).toBe('12345');
  });

  it('should remove non-numeric characters', () => {
    expect(cepMask('12345-678')).toBe('12345-678');
    expect(cepMask('abc12345def678')).toBe('12345-678');
  });

  it('should handle empty string', () => {
    expect(cepMask('')).toBe('');
  });

  it('should handle CEP with more digits', () => {
    expect(cepMask('123456789')).toBe('12345-678');
  });
});
