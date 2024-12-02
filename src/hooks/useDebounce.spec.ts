import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
	it('should return the initial value immediately', () => {
		const { result } = renderHook(() => useDebounce('initial', 500));

		expect(result.current).toBe('initial');
	});

	it('should update the value after the delay', () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: 'initial', delay: 500 } },
		);

		// Atualizar o valor
		rerender({ value: 'updated', delay: 500 });

		// O valor inicial deve ser retornado imediatamente
		expect(result.current).toBe('initial');

		// Simular o tempo após o delay
		act(() => {
			jest.advanceTimersByTime(500);
		});

		// Após o delay, o valor deve ser atualizado
		expect(result.current).toBe('updated');
	});

	it('should reset the delay timer if value changes quickly', () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: 'initial', delay: 500 } },
		);

		// Atualizar o valor antes do tempo limite
		rerender({ value: 'updated1', delay: 500 });
		rerender({ value: 'updated2', delay: 500 });

		// Simular tempo antes do delay
		act(() => {
			jest.advanceTimersByTime(300);
		});

		// O valor ainda deve ser o inicial, pois o delay não foi atingido
		expect(result.current).toBe('initial');

		// Simular o tempo restante
		act(() => {
			jest.advanceTimersByTime(200);
		});

		// Após o delay completo, o valor deve ser atualizado
		expect(result.current).toBe('updated2');
	});

	it('should handle number values correctly', () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: 10, delay: 500 } },
		);

		expect(result.current).toBe(10);

		rerender({ value: 20, delay: 500 });

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(result.current).toBe(20);
	});
});
