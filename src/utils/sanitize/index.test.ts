import { describe, it, expect } from 'vitest';
import { sanitize } from './index';

describe('sanitize', () => {
  it('should remove HTML tags', () => {
    const input = '<p>Test <strong>content</strong></p>';
    expect(sanitize(input)).toBe('Test content');
  });

  it('should handle empty string', () => {
    expect(sanitize('')).toBe('');
  });

  it('should handle undefined input', () => {
    expect(sanitize(undefined)).toBe('');
  });

  it('should remove script tags and content', () => {
    const input = '<p>Safe content</p><script>alert("xss")</script>';
    expect(sanitize(input)).toBe('Safe content');
  });

  it('should remove style tags and content', () => {
    const input = '<p>Content</p><style>.dangerous { color: red; }</style>';
    expect(sanitize(input)).toBe('Content');
  });

  it('should handle nested tags', () => {
    const input = '<div><p>Level 1 <span>Level 2 <em>Level 3</em></span></p></div>';
    expect(sanitize(input)).toBe('Level 1 Level 2 Level 3');
  });

  it('should preserve whitespace appropriately', () => {
    const input = '<p>First</p> <p>Second</p>';
    expect(sanitize(input)).toBe('First Second');
  });
});
