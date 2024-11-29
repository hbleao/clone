import { describe, it, expect } from 'vitest';
import { calculateDistance } from './calculateDistance';

describe('calculateDistance', () => {
	it('should return 0 for the same point', () => {
		const latitude = 0;
		const longitude = 0;

		const result = calculateDistance(latitude, longitude, latitude, longitude);

		expect(result).toBe(0);
	});

	it('should calculate the distance between two points on the equator', () => {
		const originLatitude = 0;
		const originLongitude = 0;
		const destinationLatitude = 0;
		const destinationLongitude = 90;

		const result = calculateDistance(
			originLatitude,
			originLongitude,
			destinationLatitude,
			destinationLongitude,
		);

		expect(result).toBeCloseTo(10007.54 / 4, 2); // 1/4 da circunferência da Terra
	});

	it('should calculate the distance between two points with different latitudes and longitudes', () => {
		const originLatitude = -22.9068; // Rio de Janeiro, Brasil
		const originLongitude = -43.1729;
		const destinationLatitude = 40.7128; // Nova Iorque, EUA
		const destinationLongitude = -74.006;

		const result = calculateDistance(
			originLatitude,
			originLongitude,
			destinationLatitude,
			destinationLongitude,
		);

		expect(result).toBeCloseTo(7681.7, 1); // Aproximadamente 7681.7 km
	});

	it('should handle negative longitudes and latitudes', () => {
		const originLatitude = -34.6037; // Buenos Aires, Argentina
		const originLongitude = -58.3816;
		const destinationLatitude = -33.8688; // Sydney, Austrália
		const destinationLongitude = 151.2093;

		const result = calculateDistance(
			originLatitude,
			originLongitude,
			destinationLatitude,
			destinationLongitude,
		);

		expect(result).toBeCloseTo(11809.5, 1); // Aproximadamente 11.809,5 km
	});
});
