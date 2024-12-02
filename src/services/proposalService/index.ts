'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';
import { GtmMeasurementProtocolService } from '../measurementProtocol';
import { getIp } from './getIp';

export async function ProposalService(param: any) {
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/hub-vendas-carbon/prestacao-servico/v1/proposta`;

	const body = {
		scope: 'porto_service',
		...param,
		ipAddress: await getIp(),
	};

	const httpResponse = await authorizedApi.post(endpoint, body);

	if (httpResponse.status === 200) {
		const response = httpResponse.data;

		const { serviceProvision } = param;

		await GtmMeasurementProtocolService({
			documentNumber: serviceProvision?.serviceOrder?.requester.documentNumber,
			leadId: response.idLead,
			products: serviceProvision?.products?.[0]?.items,
		});

		return { ...response, status: httpResponse.status };
	}

	return {
		result: {},
		status: httpResponse,
	};
}
