import { describe, it, expect } from 'vitest';
import { onlyNumbers } from './onlyNumbers';

describe('onlyNumbers', () => {
  it('should remove all non-numeric characters', () => {
    expect(onlyNumbers('abc123def456')).toBe('123456');
    expect(onlyNumbers('!@#$%123')).toBe('123');
  });

  it('should handle string with only numbers', () => {
    expect(onlyNumbers('123456')).toBe('123456');
  });

  it('should handle string with no numbers', () => {
    expect(onlyNumbers('abcdef')).toBe('');
  });

  it('should handle empty string', () => {
    expect(onlyNumbers('')).toBe('');
  });

  it('should handle special characters', () => {
    expect(onlyNumbers('123-456.789')).toBe('123456789');
    expect(onlyNumbers('(11) 99999-9999')).toBe('11999999999');
  });
});
