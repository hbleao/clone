import { describe, it, expect } from 'vitest';
import { textTruncate } from './index';

describe('textTruncate/index.ts', () => {
  it('should truncate text to specified length', () => {
    const text = 'This is a long text that needs to be truncated';
    const result = textTruncate(text, 20);
    expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    expect(result).toContain('...');
  });

  it('should not truncate text shorter than limit', () => {
    const text = 'Short text';
    expect(textTruncate(text, 20)).toBe(text);
  });

  it('should handle empty string', () => {
    expect(textTruncate('', 10)).toBe('');
  });

  it('should handle undefined text', () => {
    expect(textTruncate(undefined, 10)).toBe('');
  });

  it('should handle zero length', () => {
    expect(textTruncate('Some text', 0)).toBe('...');
  });
});
