import { describe, it, expect, vi } from 'vitest';
import { ScopeAndEligibilityService } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

mockAuthorizedApi.post.mockImplementation(async () => ({
  status: 200,
  data: {
    coverage: true,
    initialValue: '100',
    additionalNightValue: '10',
    technicalVisitValue: '20',
    kmValue: '5',
    additionalValue: '15',
    addressData: {
      street: 'Rua Exemplo',
      city: 'São Paulo',
      neighborhood: 'Centro',
      postalCode: '01000-000',
      stateCode: 'SP',
      state: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
    },
  },
}));

describe('ScopeAndEligibilityService', () => {
  it('deve retornar dados de elegibilidade quando a chamada à API for bem-sucedida', async () => {
    const result = await ScopeAndEligibilityService({ cep: '01000-000', partnerProductId: '123' });
    expect(result).toEqual({
      coverage: true,
      initialValue: '100',
      additionalNightValue: '10',
      technicalVisitValue: '20',
      kmValue: '5',
      additionalValue: '15',
      addressData: {
        street: 'Rua Exemplo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        postalCode: '01000-000',
        stateCode: 'SP',
        state: 'São Paulo',
        latitude: -23.55052,
        longitude: -46.633308,
      },
      statusCode: 200,
    });
  });

  it('deve retornar status 500 quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT;

    const result = await ScopeAndEligibilityService({ cep: '01000-000', partnerProductId: '123' });
    expect(result).toEqual({
      statusCode: 500,
      coverage: false,
      additionalNightValue: '',
      additionalValue: '',
      addressData: {
        street: '',
        city: '',
        neighborhood: '',
        postalCode: '',
        stateCode: '',
        state: '',
        latitude: 0,
        longitude: 0,
      },
      initialValue: '',
      kmValue: '',
      technicalVisitValue: '',
    });

    process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT = originalEnv;
  });

  it('deve retornar status 500 quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await ScopeAndEligibilityService({ cep: '01000-000', partnerProductId: '123' });
    expect(result).toEqual({
      statusCode: 500,
      coverage: false,
      additionalNightValue: '',
      additionalValue: '',
      addressData: {
        street: '',
        city: '',
        neighborhood: '',
        postalCode: '',
        stateCode: '',
        state: '',
        latitude: 0,
        longitude: 0,
      },
      initialValue: '',
      kmValue: '',
      technicalVisitValue: '',
    });
  });
});
