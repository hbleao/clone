import { describe, it, expect, vi } from 'vitest';
import { GtmMeasurementProtocolService } from './index';
import { cookies } from 'next/headers';

vi.mock('next/headers');

const mockCookies = cookies as vi.Mocked<typeof cookies>;

mockCookies.mockReturnValue({
  get: vi.fn().mockReturnValue({ value: 'GA1.1.1234567890.1234567890' }),
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockResponse = (ok = true) => {
  return {
    ok,
    statusText: 'OK',
  };
};

describe('GtmMeasurementProtocolService', () => {
  it('deve enviar dados corretamente quando a chamada à API for bem-sucedida', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse());

    await GtmMeasurementProtocolService({
      leadId: 'lead123',
      products: [{ category: 'CategoriaTeste' }],
      documentNumber: '12345678900',
    });

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('https://www.google-analytics.com/mp/collect'), expect.objectContaining({
      method: 'POST',
    }));
  });

  it('deve registrar um erro quando a chamada à API falhar', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce(mockResponse(false));

    await GtmMeasurementProtocolService({
      leadId: 'lead123',
      products: [{ category: 'CategoriaTeste' }],
      documentNumber: '12345678900',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send data to GTM Measurement Protocol:', 'OK');

    consoleErrorSpy.mockRestore();
  });

  it('deve registrar um erro quando a chamada à API lançar uma exceção', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    await GtmMeasurementProtocolService({
      leadId: 'lead123',
      products: [{ category: 'CategoriaTeste' }],
      documentNumber: '12345678900',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in GtmMeasurementProtocolService:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
