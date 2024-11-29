'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';
import type {
	ServiceFilterByValueProps,
	ServiceFilterByValueServiceResult,
} from './types';

export async function ServiceFilterByValueService({
	value,
}: ServiceFilterByValueProps): Promise<ServiceFilterByValueServiceResult> {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/produtos`;

	const body = JSON.stringify({ type: 'filter', value });

	const response = await authorizedApi.post<ServiceFilterByValueServiceResult>(
		endpoint,
		body,
	);

	if (response.status === 200) {
		return response.data;
	}

	return [] as ServiceFilterByValueServiceResult;
}
