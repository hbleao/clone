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
	const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_ENDPOINT')}/abrangencia/elegibilidade`;

	const data = {
		partnerProductId,
		postalCode: cep.replace('-', ''),
	};

	const httpResponse = await authorizedApi.post(endpoint, JSON.stringify(data));

	if (httpResponse.status === 200) {
		return {
			...httpResponse.data,
			statusCode: httpResponse.status,
		};
	}

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
};
