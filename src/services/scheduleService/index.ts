'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';
import type { ScheduleServiceProps, ScheduleServiceResponse } from './types';

export async function ScheduleService({ body }: ScheduleServiceProps): Promise<ScheduleServiceResponse> {
  const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_ENDPOINT');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_ENDPOINT');
    return {
      status: 500,
      selectedHour: '',
      selectedDate: {},
      availableDays: [],
    };
  }

  const endpoint = `${baseUrl}/agendamento/disponibilidade`;

  try {
    const response = await authorizedApi.post(endpoint, body);
    if (response.status === 200) {
      return response.data;
    }
    console.warn(`ScheduleService: Código de status inesperado ${response.status}`);
    return {
      status: response.status,
      selectedHour: '',
      selectedDate: {},
      availableDays: [],
    };
  } catch (error) {
    console.error('Erro na ScheduleService:', error);
    return {
      status: 500,
      selectedHour: '',
      selectedDate: {},
      availableDays: [],
    };
  }
}
