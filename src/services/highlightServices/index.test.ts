import { describe, it, expect, vi } from 'vitest';
import { HighlightService } from './index';
import { authorizedApi } from '@/lib';
import type { IProduct } from '@/dtos';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

describe('HighlightService', () => {
  it('should return product data when API call is successful', async () => {
    const mockData: IProduct[] = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];

    mockAuthorizedApi.post.mockResolvedValueOnce({
      status: 200,
      data: mockData,
    });

    const result = await HighlightService();

    expect(result).toEqual({
      data: mockData,
      status: 200,
    });
  });

  it('should return empty data when API call fails', async () => {
    mockAuthorizedApi.post.mockResolvedValueOnce({
      status: 500,
      data: [],
    });

    const result = await HighlightService();

    expect(result).toEqual({
      data: [],
      status: 500,
    });
  });

  it('should return empty data when API call throws an exception', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Network Error'));

    const result = await HighlightService();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in HighlightService:', expect.any(Error));
    expect(result).toEqual({
      data: [],
      status: 500,
    });

    consoleErrorSpy.mockRestore();
  });
});
