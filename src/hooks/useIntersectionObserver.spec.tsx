import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
	it('should return default values initially', () => {
		const { result } = renderHook(() => useIntersectionObserver({}));

		expect(result.current.entry).toBeNull();
		expect(result.current.ref.current).toBeNull();
	});

	it('should observe the element and update the entry when intersecting', () => {
		const mockObserve = jest.fn();
		const mockDisconnect = jest.fn();

		const mockIntersectionObserver = jest.fn(() => ({
			observe: mockObserve,
			disconnect: mockDisconnect,
		}));

		global.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;

		const { result } = renderHook(() => useIntersectionObserver({}));

		// Simula a associação de um elemento ao ref
		const mockElement = document.createElement('div');
		act(() => {
			result.current.ref.current = mockElement;
		});

		expect(mockObserve).toHaveBeenCalledWith(mockElement);
	});

	it('should disconnect the observer on unmount', () => {
		const mockObserve = jest.fn();
		const mockDisconnect = jest.fn();

		const mockIntersectionObserver = jest.fn(() => ({
			observe: mockObserve,
			disconnect: mockDisconnect,
		}));

		global.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;

		const { result, unmount } = renderHook(() => useIntersectionObserver({}));

		// Simula a desmontagem do componente
		unmount();

		expect(mockDisconnect).toHaveBeenCalled();
	});

	it('should handle custom root, rootMargin, and threshold', () => {
		const mockObserve = jest.fn();

		const mockIntersectionObserver = jest.fn(() => ({
			observe: mockObserve,
			disconnect: jest.fn(),
		}));

		global.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;

		const rootElement = document.createElement('div');

		renderHook(() =>
			useIntersectionObserver({
				root: rootElement,
				rootMargin: '10px',
				threshold: 0.5,
			}),
		);

		expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
			root: rootElement,
			rootMargin: '10px',
			threshold: 0.5,
		});
	});
});
