import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getMaxHeight } from './getMaxHeight';

describe('getMaxHeight.ts', () => {
  const mockElements = [
    { clientHeight: 100 },
    { clientHeight: 150 },
    { clientHeight: 120 }
  ];

  beforeEach(() => {
    // Mock document.querySelectorAll
    vi.stubGlobal('document', {
      querySelectorAll: vi.fn().mockReturnValue(mockElements)
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return default height when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(getMaxHeight('.test-selector')).toBe(0);
  });

  it('should return default height for empty selector', () => {
    expect(getMaxHeight('')).toBe(0);
    expect(getMaxHeight('   ')).toBe(0);
  });

  it('should return default height when no elements found', () => {
    vi.stubGlobal('document', {
      querySelectorAll: vi.fn().mockReturnValue([])
    });
    expect(getMaxHeight('.test-selector')).toBe(0);
  });

  it('should calculate max height with default offset', () => {
    const maxHeight = Math.max(...mockElements.map(el => el.clientHeight));
    expect(getMaxHeight('.test-selector')).toBe(maxHeight + 10);
  });

  it('should calculate max height with custom offset', () => {
    const customOffset = 20;
    const maxHeight = Math.max(...mockElements.map(el => el.clientHeight));
    expect(getMaxHeight('.test-selector', { offset: customOffset })).toBe(maxHeight + customOffset);
  });

  it('should handle elements with zero height', () => {
    vi.stubGlobal('document', {
      querySelectorAll: vi.fn().mockReturnValue([
        { clientHeight: 0 },
        { clientHeight: 0 }
      ])
    });
    expect(getMaxHeight('.test-selector')).toBe(0);
  });

  it('should handle error and return default height', () => {
    vi.stubGlobal('document', {
      querySelectorAll: vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      })
    });
    expect(getMaxHeight('.test-selector')).toBe(0);
  });
});
