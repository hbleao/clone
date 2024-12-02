import { renderHook, act } from '@testing-library/react';
import { useScrollBlock } from './useScrollBlock';

describe('useScrollBlock', () => {
	let originalInnerWidth: number;
	let originalClientWidth: number;

	beforeAll(() => {
		originalInnerWidth = window.innerWidth;
		originalClientWidth = document.documentElement.clientWidth;

		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: 1000,
		});

		Object.defineProperty(document.documentElement, 'clientWidth', {
			writable: true,
			value: 980,
		});
	});

	afterAll(() => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: originalInnerWidth,
		});

		Object.defineProperty(document.documentElement, 'clientWidth', {
			writable: true,
			value: originalClientWidth,
		});
	});

	it('should block scroll when blockScroll is called', () => {
		const { result } = renderHook(() => useScrollBlock());
		const [blockScroll] = result.current;

		act(() => {
			blockScroll();
		});

		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.body.style.overflow).toBe('hidden');
		expect(document.body.style.paddingRight).toBe('20px'); // Simula barra de rolagem
	});

	it('should allow scroll when allowScroll is called', () => {
		const { result } = renderHook(() => useScrollBlock());
		const [, allowScroll] = result.current;

		act(() => {
			allowScroll();
		});

		expect(document.documentElement.style.overflow).toBe('');
		expect(document.body.style.overflow).toBe('');
		expect(document.body.style.paddingRight).toBe('');
	});

	it('should handle multiple calls to blockScroll without duplicating styles', () => {
		const { result } = renderHook(() => useScrollBlock());
		const [blockScroll] = result.current;

		act(() => {
			blockScroll();
			blockScroll(); // Segunda chamada deve ser ignorada
		});

		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('should handle calls to allowScroll without prior blockScroll', () => {
		const { result } = renderHook(() => useScrollBlock());
		const [, allowScroll] = result.current;

		act(() => {
			allowScroll(); // Deve ser inofensivo
		});

		expect(document.documentElement.style.overflow).toBe('');
		expect(document.body.style.overflow).toBe('');
	});
});
