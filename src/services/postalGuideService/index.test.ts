import { describe, it, expect, vi } from 'vitest';
import { PostalGuideService } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

mockAuthorizedApi.get.mockImplementation(async () => ({
  data: [{ city: 'Cidade Teste', state: 'SP' }],
}));

describe('PostalGuideService', () => {
  it('deve retornar dados quando a chamada à API for bem-sucedida', async () => {
    const result = await PostalGuideService('SP');
    expect(result).toEqual({ data: [{ city: 'Cidade Teste', state: 'SP' }] });
  });

  it('deve retornar dados vazios quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_URL;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_URL;

    const result = await PostalGuideService('SP');
    expect(result).toEqual({ data: [] });

    process.env.NEXT_PUBLIC_CARBON_BASE_URL = originalEnv;
  });

  it('deve retornar dados vazios quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.get.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await PostalGuideService('SP');
    expect(result).toEqual({ data: [] });
  });
});
