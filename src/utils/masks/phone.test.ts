import { describe, it, expect } from 'vitest';
import { phoneMask } from './phone';

describe('phoneMask', () => {
  it('should format mobile phone correctly', () => {
    expect(phoneMask('11999999999')).toBe('(11) 99999-9999');
  });

  it('should format landline correctly', () => {
    expect(phoneMask('1133333333')).toBe('(11) 3333-3333');
  });

  it('should handle partial phone input', () => {
    expect(phoneMask('11')).toBe('(11');
    expect(phoneMask('119')).toBe('(11) 9');
    expect(phoneMask('11999')).toBe('(11) 999');
  });

  it('should remove non-numeric characters', () => {
    expect(phoneMask('(11) 99999-9999')).toBe('(11) 99999-9999');
    expect(phoneMask('abc11def99999ghi9999')).toBe('(11) 99999-9999');
  });

  it('should handle empty string', () => {
    expect(phoneMask('')).toBe('');
  });

  it('should handle phone with more digits', () => {
    expect(phoneMask('119999999999')).toBe('(11) 99999-9999');
  });
});
