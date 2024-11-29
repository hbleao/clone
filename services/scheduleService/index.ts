'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';
import type { ScheduleServiceProps } from './types';

export async function ScheduleService({ body }: ScheduleServiceProps) {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_ENDPOINT')}/agendamento/disponibilidade`;

	const httpResponse = await authorizedApi.post(endpoint, body);

	if (httpResponse.status === 200) return httpResponse.data;

	return {
		status: httpResponse.status,
		selectedHour: '',
		selectedDate: {},
		availableDays: [],
	};
}
