import { describe, it, expect } from 'vitest';
import { getStepParam } from './index';

describe('getStepParam', () => {
  it('should get step from URLSearchParams', () => {
    const params = new URLSearchParams('?step=2');
    expect(getStepParam(params)).toBe('2');
  });

  it('should return undefined when step is not present', () => {
    const params = new URLSearchParams('?other=value');
    expect(getStepParam(params)).toBeUndefined();
  });

  it('should handle empty URLSearchParams', () => {
    const params = new URLSearchParams();
    expect(getStepParam(params)).toBeUndefined();
  });

  it('should handle multiple step parameters', () => {
    const params = new URLSearchParams('?step=1&step=2');
    expect(getStepParam(params)).toBe('1');
  });

  it('should handle step with empty value', () => {
    const params = new URLSearchParams('?step=');
    expect(getStepParam(params)).toBe('');
  });
});
