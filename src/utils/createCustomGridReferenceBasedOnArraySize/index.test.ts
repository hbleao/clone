import { describe, it, expect } from 'vitest';
import { createCustomGridReferenceBasedOnArraySize } from './index';

describe('createCustomGridReferenceBasedOnArraySize', () => {
  it('should create correct grid for array size 1', () => {
    const result = createCustomGridReferenceBasedOnArraySize(1);
    expect(result).toEqual({
      gridTemplateColumns: 'repeat(1, 1fr)',
      gridTemplateAreas: '"area1"'
    });
  });

  it('should create correct grid for array size 2', () => {
    const result = createCustomGridReferenceBasedOnArraySize(2);
    expect(result).toEqual({
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateAreas: '"area1 area2"'
    });
  });

  it('should create correct grid for array size 4', () => {
    const result = createCustomGridReferenceBasedOnArraySize(4);
    expect(result).toEqual({
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateAreas: '"area1 area2" "area3 area4"'
    });
  });

  it('should handle array size 0', () => {
    const result = createCustomGridReferenceBasedOnArraySize(0);
    expect(result).toEqual({
      gridTemplateColumns: 'repeat(1, 1fr)',
      gridTemplateAreas: '""'
    });
  });
});
