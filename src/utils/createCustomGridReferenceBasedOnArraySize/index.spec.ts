import { describe, it, expect } from 'vitest';
import { createCustomGrid } from './createCustomGrid';

describe('createCustomGrid', () => {
	it('should return the original grid if arrayReference is not an array', () => {
		const grid = [{ mobile: [1, 2, 3] }, { desktop: [4, 5, 6] }];
		const arrayReference = null;

		const result = createCustomGrid(arrayReference as unknown as any[], grid);

		expect(result).toEqual(grid);
	});

	it('should create a custom grid based on the arrayReference size', () => {
		const grid = [
			{ mobile: [1, 2] },
			{ desktop: [3, 4] },
		];
		const arrayReference = [0, 1, 2, 3];

		const result = createCustomGrid(arrayReference, grid);

		expect(result).toEqual([
			{ mobile: [1, 2] },
			{ desktop: [3, 4] },
			{ mobile: [1, 2] },
			{ desktop: [3, 4] },
		]);
	});

	it('should handle an empty arrayReference', () => {
		const grid = [{ mobile: [1] }];
		const arrayReference: any[] = [];

		const result = createCustomGrid(arrayReference, grid);

		expect(result).toEqual([]);
	});

	it('should return an empty grid if no grid is provided', () => {
		const arrayReference = [0, 1, 2];

		const result = createCustomGrid(arrayReference);

		expect(result).toEqual([]);
	});

	it('should handle cases where grid length is less than arrayReference size', () => {
		const grid = [
			{ mobile: [1] },
			{ desktop: [2] },
		];
		const arrayReference = [0, 1, 2, 3, 4];

		const result = createCustomGrid(arrayReference, grid);

		expect(result).toEqual([
			{ mobile: [1] },
			{ desktop: [2] },
			{ mobile: [1] },
			{ desktop: [2] },
			{ mobile: [1] },
		]);
	});
});
