import { describe, it, expect, vi } from 'vitest';
import { WorkshopByLatLngService } from './index';

vi.mock('next-runtime-env', () => ({
  env: () => 'http://example.com',
}));

vi.mock('node-fetch', () => ({
  default: vi.fn().mockImplementation(async (url) => {
    if (url.includes('error')) {
      return { ok: false, status: 404, statusText: 'Not Found' };
    }
    return {
      ok: true,
      json: async () => [{ id: 1, name: 'Workshop 1' }, { id: 2, name: 'Workshop 2' }],
    };
  }),
}));

const fetch = require('node-fetch');

describe('WorkshopByLatLngService', () => {
  it('deve retornar workshops quando a chamada à API for bem-sucedida', async () => {
    const result = await WorkshopByLatLngService('40.7128', '-74.0060');
    expect(result).toEqual([
      { id: 1, name: 'Workshop 1' },
      { id: 2, name: 'Workshop 2' },
    ]);
  });

  it('deve retornar um array vazio quando a variável de ambiente estiver ausente', async () => {
    vi.mocked(fetch).mockImplementationOnce(() => {
      throw new Error('Variável de ambiente ausente');
    });

    const result = await WorkshopByLatLngService('40.7128', '-74.0060');
    expect(result).toEqual([]);
  });

  it('deve retornar um array vazio quando a chamada à API falhar', async () => {
    const result = await WorkshopByLatLngService('error', 'error');
    expect(result).toEqual([]);
  });
});
