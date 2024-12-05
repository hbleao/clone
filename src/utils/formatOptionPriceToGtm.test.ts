import { describe, expect, it, vi } from 'vitest';
import { formatOptionPriceToGtm } from './formatOptionPriceToGtm';

// Mocking the formattedPrice function
vi.mock('@/utils', () => ({
	formattedPrice: (value: number) => `R$ ${value.toFixed(2)}`,
}));

describe('formatOptionPriceToGtm', () => {
	it('deve formatar corretamente um preço válido', () => {
		expect(formatOptionPriceToGtm(123.45)).toBe('123.45');
	});

	it('deve retornar uma string vazia para entrada inválida', () => {
		expect(formatOptionPriceToGtm(Number.NaN)).toBe('');
		expect(formatOptionPriceToGtm('abc' as any)).toBe('');
	});

	it('deve remover o símbolo de moeda e espaços em branco', () => {
		expect(formatOptionPriceToGtm(1000)).toBe('1000.00');
	});
});
