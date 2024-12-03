import { describe, it, expect } from 'vitest';
import { slugify } from './index';

describe('slugify/index.ts', () => {
  it('should convert string to URL-friendly format', () => {
    expect(slugify('This is a test')).toBe('this-is-a-test');
  });

  it('should handle special characters', () => {
    expect(slugify('Áçêntös & Símböls')).toBe('acentos-symbols');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
  });

  it('should handle special characters and numbers', () => {
    expect(slugify('Test123!@#')).toBe('test123');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('should handle undefined', () => {
    expect(slugify(undefined)).toBe('');
  });
});
