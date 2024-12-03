import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatAemImageUrl } from './formatAemImageUrl';

describe('formatAemImageUrl.ts', () => {
  const mockEnv = {
    VITE_AEM_BASE_URL: 'https://aem.example.com'
  };

  beforeEach(() => {
    vi.stubGlobal('import.meta', { env: mockEnv });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return undefined for undefined input', () => {
    expect(formatAemImageUrl(undefined)).toBeUndefined();
  });

  it('should return empty string for empty input', () => {
    expect(formatAemImageUrl('')).toBe('');
    expect(formatAemImageUrl('   ')).toBe('');
  });

  it('should format URL with base URL from environment', () => {
    const path = '/content/dam/image.jpg';
    const expected = 'https://aem.example.com/content/dam/image.jpg';
    expect(formatAemImageUrl(path)).toBe(expected);
  });

  it('should remove leading and trailing slashes', () => {
    const path = '///content/dam/image.jpg///';
    const expected = 'https://aem.example.com/content/dam/image.jpg';
    expect(formatAemImageUrl(path)).toBe(expected);
  });

  it('should handle URLs with query parameters', () => {
    const path = '/content/dam/image.jpg?width=100';
    const expected = 'https://aem.example.com/content/dam/image.jpg?width=100';
    expect(formatAemImageUrl(path)).toBe(expected);
  });

  it('should handle full URLs', () => {
    const path = 'https://other.example.com/image.jpg';
    expect(formatAemImageUrl(path)).toBe(path);
  });

  it('should handle URLs with no base URL configured', () => {
    vi.stubGlobal('import.meta', { env: {} });
    const path = '/content/dam/image.jpg';
    expect(formatAemImageUrl(path)).toBe(path);
  });
});
