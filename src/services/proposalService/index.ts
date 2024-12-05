'use server';

import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';
import { GtmMeasurementProtocolService } from '../measurementProtocol';
import { getIp } from './getIp';
import type { ProposalServiceResponse } from './types';

export async function ProposalService(param: any): Promise<ProposalServiceResponse> {
  const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');

  if (!baseUrl) {
    console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_URL');
    return { result: {}, status: 500 };
  }

  const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/proposta`;

  const body = {
    scope: 'porto_service',
    ...param,
    ipAddress: await getIp(),
  };

  try {
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

    console.warn(`ProposalService: Código de status inesperado ${httpResponse.status}`);
    return { result: {}, status: httpResponse.status };
  } catch (error) {
    console.error('Erro na ProposalService:', error);
    return { result: {}, status: 500 };
  }
}
