import { describe, it, expect, vi } from 'vitest';
import { ServiceFilterByValueService } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

mockAuthorizedApi.post.mockImplementation(async () => ({
  status: 200,
  data: [
    { id: '1', name: 'Product 1' },
    { id: '2', name: 'Product 2' },
  ],
}));

describe('ServiceFilterByValueService', () => {
  it('deve retornar produtos filtrados quando a chamada à API for bem-sucedida', async () => {
    const result = await ServiceFilterByValueService({ value: 'test' });
    expect(result).toEqual([
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
    ]);
  });

  it('deve retornar um array vazio quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_URL;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_URL;

    const result = await ServiceFilterByValueService({ value: 'test' });
    expect(result).toEqual([]);

    process.env.NEXT_PUBLIC_CARBON_BASE_URL = originalEnv;
  });

  it('deve retornar um array vazio quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await ServiceFilterByValueService({ value: 'test' });
    expect(result).toEqual([]);
  });
});
