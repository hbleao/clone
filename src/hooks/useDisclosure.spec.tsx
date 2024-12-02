import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from './useDisclosure';

describe('useDisclosure', () => {
	it('should initialize with defaultIsOpen as false', () => {
		const { result } = renderHook(() => useDisclosure());

		expect(result.current.isOpen).toBe(false);
		expect(result.current.isPending).toBe(false);
	});

	it('should initialize with defaultIsOpen as true', () => {
		const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true }));

		expect(result.current.isOpen).toBe(true);
	});

	it('should open the disclosure when onOpen is called', () => {
		const { result } = renderHook(() => useDisclosure());

		act(() => {
			result.current.onOpen();
		});

		expect(result.current.isOpen).toBe(true);
	});

	it('should close the disclosure when onClose is called', () => {
		const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true }));

		act(() => {
			result.current.onClose();
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('should toggle the disclosure when onToggle is called', () => {
		const { result } = renderHook(() => useDisclosure());

		act(() => {
			result.current.onToggle();
		});

		expect(result.current.isOpen).toBe(true);

		act(() => {
			result.current.onToggle();
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('should handle transitions with isPending', () => {
		const { result } = renderHook(() => useDisclosure());

		act(() => {
			result.current.onOpen();
		});

		expect(result.current.isPending).toBe(false); // Simulated as synchronous for testing
	});
});
