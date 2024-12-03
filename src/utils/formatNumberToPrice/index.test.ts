import { describe, it, expect } from 'vitest';
import { formatNumberToPrice } from './index';

describe('formatNumberToPrice', () => {
  it('should format integer numbers correctly', () => {
    expect(formatNumberToPrice(1000)).toBe('R$ 1.000,00');
    expect(formatNumberToPrice(1)).toBe('R$ 1,00');
  });

  it('should format decimal numbers correctly', () => {
    expect(formatNumberToPrice(1000.50)).toBe('R$ 1.000,50');
    expect(formatNumberToPrice(1.99)).toBe('R$ 1,99');
  });

  it('should handle zero', () => {
    expect(formatNumberToPrice(0)).toBe('R$ 0,00');
  });

  it('should handle negative numbers', () => {
    expect(formatNumberToPrice(-1000.50)).toBe('-R$ 1.000,50');
    expect(formatNumberToPrice(-1)).toBe('-R$ 1,00');
  });

  it('should handle undefined and null', () => {
    expect(formatNumberToPrice(undefined)).toBe('R$ 0,00');
    expect(formatNumberToPrice(null)).toBe('R$ 0,00');
  });

  it('should handle large numbers', () => {
    expect(formatNumberToPrice(1000000)).toBe('R$ 1.000.000,00');
    expect(formatNumberToPrice(1000000.99)).toBe('R$ 1.000.000,99');
  });
});
