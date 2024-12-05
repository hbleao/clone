import { describe, it, expect, vi } from 'vitest';
import { PricingService } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

mockAuthorizedApi.post.mockImplementation(async () => ({
  status: 200,
  data: { price: 100 },
}));

describe('PricingService', () => {
  it('deve retornar dados de preço quando a chamada à API for bem-sucedida', async () => {
    const result = await PricingService({ body: { productId: '123' } });
    expect(result).toEqual({ price: 100, status: 200 });
  });

  it('deve retornar status 500 quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_URL;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_URL;

    const result = await PricingService({ body: { productId: '123' } });
    expect(result).toEqual({ status: 500, body: {} });

    process.env.NEXT_PUBLIC_CARBON_BASE_URL = originalEnv;
  });

  it('deve retornar status 500 quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await PricingService({ body: { productId: '123' } });
    expect(result).toEqual({ status: 500, body: {} });
  });
});
