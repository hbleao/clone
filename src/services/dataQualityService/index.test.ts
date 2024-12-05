import { describe, it, expect, vi } from 'vitest';
import { DataQualityService } from './index';
import { authorizedApi } from '@/lib';
import type { DataQualityServiceResponse } from './types';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

describe('DataQualityService', () => {
  it('should return valid response when API call is successful', async () => {
    const mockData: DataQualityServiceResponse = {
      isValid: true,
    };

    mockAuthorizedApi.get.mockResolvedValueOnce({
      status: 200,
      data: mockData,
    });

    const result = await DataQualityService({ type: 'email', param: 'test@example.com' });

    expect(result).toEqual({
      isValid: true,
      message: '',
    });
  });

  it('should return invalid response when API call fails', async () => {
    mockAuthorizedApi.get.mockResolvedValueOnce({
      status: 500,
      data: {},
    });

    const result = await DataQualityService({ type: 'email', param: 'test@example.com' });

    expect(result).toEqual({
      isValid: false,
      message: 'Serviço indísponivel',
    });
  });

  it('should return invalid response when API call throws an exception', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAuthorizedApi.get.mockRejectedValueOnce(new Error('Network Error'));

    const result = await DataQualityService({ type: 'email', param: 'test@example.com' });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in DataQualityService:', expect.any(Error));
    expect(result).toEqual({
      isValid: false,
      message: 'Erro ao validar dados',
    });

    consoleErrorSpy.mockRestore();
  });
});
