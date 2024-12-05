import { describe, it, expect } from 'vitest';
import { isValidLength } from './index';

describe('isValidLength', () => {
  it('deve retornar true para string com comprimento válido', () => {
    expect(isValidLength('abc', 3)).toBe(true);
  });

  it('deve retornar false para string com comprimento inválido', () => {
    expect(isValidLength('abc', 5)).toBe(false);
  });

  it('deve retornar false para entrada inválida', () => {
    expect(isValidLength(123 as any, 3)).toBe(false);
    expect(isValidLength('abc', -1)).toBe(false);
  });

  it('deve retornar false para string vazia com comprimento não zero', () => {
    expect(isValidLength('', 3)).toBe(false);
  });

  it('deve retornar true para string vazia com comprimento zero', () => {
    expect(isValidLength('', 0)).toBe(true);
  });
});
