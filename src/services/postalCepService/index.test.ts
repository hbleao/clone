import { describe, it, expect, vi } from 'vitest';
import { PostalCepService } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

describe('PostalCepService', () => {
  it('deve retornar dados quando a chamada à API for bem-sucedida', async () => {
    const mockData = { data: [{ street: 'Rua Teste', city: 'Cidade Teste' }] };

    mockAuthorizedApi.get.mockResolvedValueOnce({
      status: 200,
      data: mockData,
    });

    const result = await PostalCepService('SP', 'São Paulo', 'Paulista');

    expect(result).toEqual(mockData);
  });

  it('deve retornar dados vazios quando a chamada à API falhar', async () => {
    mockAuthorizedApi.get.mockResolvedValueOnce({
      status: 500,
      data: [],
    });

    const result = await PostalCepService('SP', 'São Paulo', 'Paulista');

    expect(result).toEqual({ data: [] });
  });

  it('deve retornar dados vazios quando a chamada à API lançar uma exceção', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAuthorizedApi.get.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await PostalCepService('SP', 'São Paulo', 'Paulista');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar dados postais:', expect.any(Error));
    expect(result).toEqual({ data: [] });

    consoleErrorSpy.mockRestore();
  });
});
