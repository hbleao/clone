import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMaxHeight } from './getMaxHeight';

describe('getMaxHeight', () => {
	beforeEach(() => {
		document.body.innerHTML = ''; // Limpar o DOM antes de cada teste
	});

	it('should return the maximum height of elements with an offset', () => {
		// Criar elementos simulados no DOM
		document.body.innerHTML = `
      <div class="test-class" style="height: 100px;"></div>
      <div class="test-class" style="height: 200px;"></div>
      <div class="test-class" style="height: 150px;"></div>
    `;

		const result = getMaxHeight('.test-class');
		expect(result).toBe(210); // Altura máxima (200) + offset (10)
	});

	it('should return 0 if no elements match the class', () => {
		const result = getMaxHeight('.non-existent-class');
		expect(result).toBe(0);
	});

	it('should return 0 if classComponentName is not provided', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const result = getMaxHeight('');
		expect(result).toBe(0);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Class name is required.');

		consoleErrorSpy.mockRestore();
	});

	it('should handle errors and log them', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Simular um erro lançando exceção ao acessar o DOM
		const mockQuerySelectorAll = vi.spyOn(document, 'querySelectorAll').mockImplementation(() => {
			throw new Error('DOM error');
		});

		const result = getMaxHeight('.test-class');
		expect(result).toBe(0);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Error calculating max height:', expect.any(Error));

		mockQuerySelectorAll.mockRestore();
		consoleErrorSpy.mockRestore();
	});
});
