import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

import type {
	DataQualityServiceProps,
	DataQualityServiceResponse,
} from './types';

export const DataQualityService = async ({
	type,
	param,
}: DataQualityServiceProps) => {
	const endpoint = `${env(
		'NEXT_PUBLIC_CARBON_BASE_URL',
	)}/hub-vendas-carbon/cliente/v1/validacoes/${param}/${type}`;

	const httpResponse =
		await authorizedApi.get<DataQualityServiceResponse>(endpoint);

	if (httpResponse.status !== 200) {
		return {
			isValid: false,
			message: 'Serviço indísponivel',
		};
	}

	return {
		...httpResponse.data,
		message: httpResponse.data.isValid ? '' : 'Valor inválido',
	};
};
