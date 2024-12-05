import { describe, it, expect } from 'vitest';
import { removeNonDigits } from './index';

describe('removeNonDigits', () => {
  it('deve remover caracteres não numéricos de uma string', () => {
    expect(removeNonDigits('abc123def')).toBe('123');
  });

  it('deve retornar uma string vazia para entrada não numérica', () => {
    expect(removeNonDigits('abc')).toBe('');
  });

  it('deve retornar a string original se contiver apenas números', () => {
    expect(removeNonDigits('123')).toBe('123');
  });

  it('deve retornar uma string vazia para entrada inválida', () => {
    expect(removeNonDigits(123 as any)).toBe('');
  });

  it('deve retornar uma string vazia para string vazia', () => {
    expect(removeNonDigits('')).toBe('');
  });
});
