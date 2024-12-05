import { describe, it, expect, vi } from 'vitest';
import { WorkshopScheduleService } from './index';

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
      json: async () => [
        {
          day: 10,
          month: 'October',
          selected: false,
          weekday: 'Monday',
          schedules: [
            { time: '09:00', serviceDateTime: '2023-10-10T09:00:00' },
          ],
        },
      ],
    };
  }),
}));

const fetch = require('node-fetch');

describe('WorkshopScheduleService', () => {
  it('deve retornar datas disponíveis quando a chamada à API for bem-sucedida', async () => {
    const result = await WorkshopScheduleService({ code: '123' });
    expect(result).toEqual([
      {
        day: 10,
        month: 'October',
        selected: false,
        weekday: 'Monday',
        schedules: [
          { time: '09:00', serviceDateTime: '2023-10-10T09:00:00' },
        ],
      },
    ]);
  });

  it('deve retornar um array vazio quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_NEXT_BASE_URL;
    delete process.env.NEXT_PUBLIC_API_NEXT_BASE_URL;

    const result = await WorkshopScheduleService({ code: '123' });
    expect(result).toEqual([]);

    process.env.NEXT_PUBLIC_API_NEXT_BASE_URL = originalEnv;
  });

  it('deve retornar um array vazio quando a chamada à API falhar', async () => {
    const result = await WorkshopScheduleService({ code: 'error' });
    expect(result).toEqual([]);
  });
});
