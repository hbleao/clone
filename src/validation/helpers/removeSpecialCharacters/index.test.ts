import { describe, it, expect } from 'vitest';
import { removeSpecialCharacters } from './index';

describe('removeSpecialCharacters', () => {
  it('deve remover caracteres especiais de uma string', () => {
    expect(removeSpecialCharacters('abc/def.ghi-jkl')).toBe('abcdefghijkl');
  });

  it('deve retornar a string original se não contiver caracteres especiais', () => {
    expect(removeSpecialCharacters('abcdef')).toBe('abcdef');
  });

  it('deve retornar uma string vazia para entrada inválida', () => {
    expect(removeSpecialCharacters(123 as any)).toBe('');
  });

  it('deve retornar uma string vazia para string vazia', () => {
    expect(removeSpecialCharacters('')).toBe('');
  });

  it('deve remover espaços em branco no início e no final', () => {
    expect(removeSpecialCharacters('  abc/def  ')).toBe('abcdef');
  });
});
