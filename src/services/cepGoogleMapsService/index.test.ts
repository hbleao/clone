import { describe, it, expect, vi } from 'vitest';
import { CepGoogleMapsService } from './index';
import type { AddressData } from './type';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockResponse = (data: any, ok = true) => {
  return {
    ok,
    json: async () => data,
  };
};

describe('CepGoogleMapsService', () => {
  it('should return address data when API call is successful', async () => {
    const mockData: AddressData = {
      cep: '12345-678',
      street: 'Mock Street',
      neighborhood: 'Mock Neighborhood',
      city: 'Mock City',
      state: 'Mock State',
      address: 'Mock Address',
      lat: '0.0000',
      lng: '0.0000',
    };

    mockFetch.mockResolvedValueOnce(mockResponse(mockData));

    const result = await CepGoogleMapsService('12345-678');

    expect(result).toEqual(mockData);
  });

  it('should return default address data when API call fails', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}, false));

    const result = await CepGoogleMapsService('12345-678');

    expect(result).toEqual({
      cep: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      address: '',
      lat: '',
      lng: '',
    });
  });

  it('should return default address data when API call throws an exception', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await CepGoogleMapsService('12345-678');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Network error in CepGoogleMapsService:', expect.any(Error));
    expect(result).toEqual({
      cep: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      address: '',
      lat: '',
      lng: '',
    });

    consoleErrorSpy.mockRestore();
  });
});
