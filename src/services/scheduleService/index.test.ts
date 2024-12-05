import { describe, it, expect, vi } from 'vitest';
import { ScheduleService } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

mockAuthorizedApi.post.mockImplementation(async () => ({
  status: 200,
  data: {
    selectedHour: '10:00',
    selectedDate: { year: 2023, month: 'October', day: 10 },
    availableDays: [
      { date: '2023-10-10', availableHours: ['09:00', '10:00'] },
    ],
  },
}));

describe('ScheduleService', () => {
  it('deve retornar dados de agendamento quando a chamada à API for bem-sucedida', async () => {
    const result = await ScheduleService({ body: { city: 'São Paulo' } });
    expect(result).toEqual({
      selectedHour: '10:00',
      selectedDate: { year: 2023, month: 'October', day: 10 },
      availableDays: [
        { date: '2023-10-10', availableHours: ['09:00', '10:00'] },
      ],
    });
  });

  it('deve retornar status 500 quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT;

    const result = await ScheduleService({ body: { city: 'São Paulo' } });
    expect(result).toEqual({
      status: 500,
      selectedHour: '',
      selectedDate: {},
      availableDays: [],
    });

    process.env.NEXT_PUBLIC_CARBON_BASE_ENDPOINT = originalEnv;
  });

  it('deve retornar status 500 quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await ScheduleService({ body: { city: 'São Paulo' } });
    expect(result).toEqual({
      status: 500,
      selectedHour: '',
      selectedDate: {},
      availableDays: [],
    });
  });
});
