

'use server';

import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type { IAddress } from '@/dtos';
import type {
	IScopeAndEligibility,
	ScopeAndEligibilityServiceResponse,
} from './types';

/**
 * Serviço para verificar abrangência e elegibilidade de um produto parceiro.
 * @param param Os parâmetros contendo o CEP e o ID do produto parceiro.
 * @returns Os dados de abrangência e elegibilidade ou valores padrão em caso de erro.
 */
export async function fetchScopeAndEligibility({
	cep,
	partnerProductId,
}: IScopeAndEligibility): Promise<ScopeAndEligibilityServiceResponse> {
	// Construir o endpoint da API
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_ENDPOINT');
	const endpoint = `${baseUrl}/abrangencia/elegibilidade`;

	// Construir o corpo da requisição
	const requestBody = {
		partnerProductId,
		postalCode: cep.replace('-', ''),
	};

	try {
		// Fazer a requisição à API
		const response = await authorizedApi.post(endpoint, JSON.stringify(requestBody));

		// Verificar se a resposta foi bem-sucedida
		if (response.status === 200) {
			return {
				...response.data,
				statusCode: response.status,
			};
		}

		// Retornar valores padrão para status diferente de 200
		return {
			statusCode: response.status,
			coverage: false,
			additionalNightValue: '',
			additionalValue: '',
			addressData: {} as IAddress,
			initialValue: '',
			kmValue: '',
			technicalVisitValue: '',
		};
	} catch (error) {
		// Logar erros inesperados
		console.error('Failed to fetch scope and eligibility:', error);

		// Retornar valores padrão em caso de exceção
		return {
			statusCode: 500,
			coverage: false,
			additionalNightValue: '',
			additionalValue: '',
			addressData: {} as IAddress,
			initialValue: '',
			kmValue: '',
			technicalVisitValue: '',
		};
	}
}
