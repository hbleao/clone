import { describe, it, expect, vi } from 'vitest';
import { CepService } from './index';
import { authorizedApi } from '@/lib';
import type { AxiosResponse } from 'axios';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

describe('CepService', () => {
  it('should return address data when API call is successful', async () => {
    const mockData = { data: { street: 'Mock Street', city: 'Mock City' } };

    mockAuthorizedApi.get.mockResolvedValueOnce({
      status: 200,
      data: mockData,
    } as AxiosResponse);

    const result = await CepService({ cep: '12345-678' });

    expect(result).toEqual(mockData);
  });

  it('should return null when API call fails', async () => {
    mockAuthorizedApi.get.mockResolvedValueOnce({
      status: 500,
      data: {},
    } as AxiosResponse);

    const result = await CepService({ cep: '12345-678' });

    expect(result).toBeNull();
  });

  it('should return null when API call throws an exception', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAuthorizedApi.get.mockRejectedValueOnce(new Error('Network Error'));

    const result = await CepService({ cep: '12345-678' });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in CepService:', expect.any(Error));
    expect(result).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
