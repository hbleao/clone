import { describe, it, expect } from 'vitest';
import { extractCheckDigits } from './index';

describe('extractCheckDigits', () => {
  it('deve retornar os dois últimos caracteres de uma string válida', () => {
    expect(extractCheckDigits('12345')).toBe('45');
  });

  it('deve retornar uma string vazia para uma entrada com menos de dois caracteres', () => {
    expect(extractCheckDigits('1')).toBe('');
  });

  it('deve retornar uma string vazia para uma entrada não-string', () => {
    expect(extractCheckDigits(12345 as any)).toBe('');
  });

  it('deve retornar uma string vazia para uma string vazia', () => {
    expect(extractCheckDigits('')).toBe('');
  });
});
