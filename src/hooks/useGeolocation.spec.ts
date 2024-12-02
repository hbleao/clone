import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

describe('useGeolocation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should initialize with default values', () => {
		const { result } = renderHook(() => useGeolocation());

		expect(result.current.coordinates).toBeNull();
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});

	it('should handle success when geolocation is supported', () => {
		const mockCoords = {
			latitude: 10,
			longitude: 20,
			accuracy: 5,
			altitude: null,
			altitudeAccuracy: null,
			heading: null,
			speed: null,
		};
		const mockGetCurrentPosition = jest.fn((success: any) =>
			success({ coords: mockCoords }),
		);
		Object.defineProperty(global.navigator, 'geolocation', {
			value: { getCurrentPosition: mockGetCurrentPosition },
		});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.requestGeolocation();
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.coordinates).toEqual(mockCoords);
		expect(result.current.error).toBeNull();
	});

	it('should handle error when geolocation fails', () => {
		const mockError = {
			code: 1,
			message: 'Permission denied',
		};
		const mockGetCurrentPosition = jest.fn((_, error: any) => error(mockError));
		Object.defineProperty(global.navigator, 'geolocation', {
			value: { getCurrentPosition: mockGetCurrentPosition },
		});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.requestGeolocation();
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.coordinates).toBeNull();
		expect(result.current.error).toEqual(mockError);
	});

	it('should handle unsupported geolocation', () => {
		Object.defineProperty(global.navigator, 'geolocation', {
			value: undefined,
		});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.requestGeolocation();
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.coordinates).toBeNull();
		expect(result.current.error).toEqual({
			code: 0,
			message: 'Geolocation is not supported by your browser.',
		});
	});
});
