import { describe, it, expect, vi } from 'vitest';
import { AuthorizationService } from './index';
import { api } from '@/lib';
import type { AuthorizationServiceResponse } from './types';

vi.mock('@/lib');

const mockApi = api as vi.Mocked<typeof api>;

describe('AuthorizationService', () => {
  it('should return access token when API call is successful', async () => {
    const mockData: AuthorizationServiceResponse = {
      access_token: 'mockAccessToken',
    };

    mockApi.post.mockResolvedValueOnce({
      status: 200,
      data: mockData,
    });

    const result = await AuthorizationService();

    expect(result).toEqual(mockData);
  });

  it('should return empty access token when API call fails', async () => {
    mockApi.post.mockResolvedValueOnce({
      status: 500,
      data: {},
    });

    const result = await AuthorizationService();

    expect(result).toEqual({ access_token: '' });
  });

  it('should return empty access token when API call throws an exception', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockApi.post.mockRejectedValueOnce(new Error('Network Error'));

    const result = await AuthorizationService();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in AuthorizationService:', expect.any(Error));
    expect(result).toEqual({ access_token: '' });

    consoleErrorSpy.mockRestore();
  });
});
