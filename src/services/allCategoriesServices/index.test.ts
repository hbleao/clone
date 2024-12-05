import type { ICategory } from '@/dtos';
import { authorizedApi } from '@/lib/axios/authorizedApi';
import { describe, expect, it, vi } from 'vitest';
import { AllCategoriesServices } from './index';

vi.mock('@/lib/axios/authorizedApi');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

describe('AllCategoriesServices', () => {
	it('should return categories when API call is successful', async () => {
		const mockData: ICategory[] = [
			{ id: '1', name: 'Category 1' },
			{ id: '2', name: 'Category 2' },
		];

		mockAuthorizedApi.post.mockResolvedValueOnce({
			status: 200,
			data: mockData,
		});

		const result = await AllCategoriesServices();

		expect(result).toEqual(mockData);
	});

	it('should return an empty array when API call fails', async () => {
		mockAuthorizedApi.post.mockResolvedValueOnce({
			status: 500,
			data: [],
		});

		const result = await AllCategoriesServices();

		expect(result).toEqual([]);
	});

	it('should return an empty array when API call throws an exception', async () => {
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});
		mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Network Error'));

		const result = await AllCategoriesServices();

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error in AllCategoriesServices:',
			expect.any(Error),
		);
		expect(result).toEqual([]);

		consoleErrorSpy.mockRestore();
	});
});
