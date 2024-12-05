import { describe, it, expect } from 'vitest';
import { isRepeatedNumbers } from './index';

describe('isRepeatedNumbers', () => {
  it('deve retornar true para números repetidos', () => {
    expect(isRepeatedNumbers('111111', 6)).toBe(true);
  });

  it('deve retornar false para números não repetidos', () => {
    expect(isRepeatedNumbers('123456', 6)).toBe(false);
  });

  it('deve retornar false para entrada inválida', () => {
    expect(isRepeatedNumbers('123', -1)).toBe(false);
    expect(isRepeatedNumbers(123 as any, 3)).toBe(false);
  });

  it('deve retornar false para string vazia', () => {
    expect(isRepeatedNumbers('', 3)).toBe(false);
  });
});
