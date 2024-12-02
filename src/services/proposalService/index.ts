
'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import { GtmMeasurementProtocolService } from '../measurementProtocol';
import { getIp } from './getIp';

/**
 * Serviço para criar uma proposta.
 * @param param Parâmetros para a criação da proposta.
 * @returns Um objeto contendo os dados da proposta e o status da requisição.
 */
export async function createProposal(param: Record<string, any>): Promise<{ data: any; status: number }> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
	const endpoint = `${baseUrl}/hub-vendas-carbon/prestacao-servico/v1/proposta`;

	try {
		// Construir o corpo da requisição
		const body = {
			scope: 'porto_service',
			...param,
			ipAddress: await getIp(),
		};

		// Fazer a requisição à API
		const response = await authorizedApi.post(endpoint, body);

		// Verificar se a resposta foi bem-sucedida
		if (response.status === 200) {
			const { data } = response;
			const { serviceProvision } = param;

			// Enviar evento ao GTM Measurement Protocol
			await GtmMeasurementProtocolService({
				documentNumber: serviceProvision?.serviceOrder?.requester?.documentNumber,
				leadId: data?.idLead,
				products: serviceProvision?.products?.[0]?.items,
			});

			return {
				data,
				status: response.status,
			};
		}

		// Retornar erro padronizado para status diferente de 200
		return {
			data: {},
			status: response.status,
		};
	} catch (error) {
		// Logar erros inesperados
		console.error('Failed to create proposal:', error);

		// Retornar erro padronizado em caso de exceção
		return {
			data: {},
			status: 500,
		};
	}
}
