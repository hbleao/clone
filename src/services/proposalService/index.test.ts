import { describe, it, expect, vi } from 'vitest';
import { ProposalService } from './index';
import { authorizedApi } from '@/lib';
import { GtmMeasurementProtocolService } from '../measurementProtocol';

vi.mock('@/lib');
vi.mock('../measurementProtocol');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;
const mockGtmService = GtmMeasurementProtocolService as vi.Mock;

mockAuthorizedApi.post.mockImplementation(async () => ({
  status: 200,
  data: { idLead: 'lead-123' },
}));

mockGtmService.mockResolvedValue(undefined);

describe('ProposalService', () => {
  it('deve retornar dados de proposta quando a chamada à API for bem-sucedida', async () => {
    const result = await ProposalService({ serviceProvision: { serviceOrder: { requester: { documentNumber: '123456789' } }, products: [{ items: [] }] } });
    expect(result).toEqual({ idLead: 'lead-123', status: 200 });
  });

  it('deve retornar status 500 quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_URL;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_URL;

    const result = await ProposalService({});
    expect(result).toEqual({ result: {}, status: 500 });

    process.env.NEXT_PUBLIC_CARBON_BASE_URL = originalEnv;
  });

  it('deve retornar status 500 quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await ProposalService({});
    expect(result).toEqual({ result: {}, status: 500 });
  });
});
