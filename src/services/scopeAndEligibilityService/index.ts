'use server';

import { env } from 'next-runtime-env';

import type { IAddress } from '@/dtos';

import { authorizedApi } from '@/lib';
import type {
	IScopeAndEligibility,
	ScopeAndEligibilityServiceResponse,
} from './types';

export const ScopeAndEligibilityService = async ({
	cep,
	partnerProductId,
}: IScopeAndEligibility): Promise<ScopeAndEligibilityServiceResponse> => {
	const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_ENDPOINT');

	if (!baseUrl) {
		console.error('Variável de ambiente ausente: NEXT_PUBLIC_CARBON_BASE_ENDPOINT');
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

	const endpoint = `${baseUrl}/abrangencia/elegibilidade`;

	const data = {
		partnerProductId,
		postalCode: cep.replace('-', ''),
	};

	try {
		const httpResponse = await authorizedApi.post(endpoint, JSON.stringify(data));

		if (httpResponse.status === 200) {
			return {
				...httpResponse.data,
				statusCode: httpResponse.status,
			};
		}

		console.warn(`ScopeAndEligibilityService: Código de status inesperado ${httpResponse.status}`);
		return {
			statusCode: httpResponse.status,
			coverage: false,
			additionalNightValue: '',
			additionalValue: '',
			addressData: {} as IAddress,
			initialValue: '',
			kmValue: '',
			technicalVisitValue: '',
		};
	} catch (error) {
		console.error('Erro na ScopeAndEligibilityService:', error);
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
};
