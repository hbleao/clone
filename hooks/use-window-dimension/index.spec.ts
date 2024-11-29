import { renderHook, act } from '@testing-library/react';
import { useWindowDimensions } from './useWindowDimensions';

describe('useWindowDimensions', () => {
	let originalInnerWidth: number;
	let originalInnerHeight: number;

	beforeAll(() => {
		// Salvar valores originais
		originalInnerWidth = window.innerWidth;
		originalInnerHeight = window.innerHeight;
	});

	afterAll(() => {
		// Restaurar valores originais
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: originalInnerWidth,
		});

		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			value: originalInnerHeight,
		});
	});

	it('should return the initial dimensions of the window', () => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: 1024,
		});
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			value: 768,
		});

		const { result } = renderHook(() => useWindowDimensions());

		expect(result.current).toEqual({ width: 1024, height: 768 });
	});

	it('should update dimensions when the window is resized', () => {
		const { result } = renderHook(() => useWindowDimensions());

		act(() => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				value: 1280,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				value: 720,
			});
			window.dispatchEvent(new Event('resize'));
		});

		expect(result.current).toEqual({ width: 1280, height: 720 });
	});

	it('should return default dimensions in non-browser environments', () => {
		const originalWindow = global.window;
		// Simular ambiente sem suporte ao objeto `window`
		delete (global as any).window;

		const { result } = renderHook(() => useWindowDimensions());

		expect(result.current).toEqual({ width: 0, height: 0 });

		// Restaurar o objeto `window`
		global.window = originalWindow;
	});
});
