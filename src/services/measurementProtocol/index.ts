'use server';

import { encryptValue } from '@/utils';
import { removeSpecialCharacters } from '@/validation/helpers';
import { env } from 'next-runtime-env';
import { cookies } from 'next/headers';

const MEASUREMENT_ID = env('NEXT_PUBLIC_GTM_MEASUREMENT_ID');
const GTM_API_SECRET = env('NEXT_PUBLIC_GTM_API_SECRET');
const GTM_API_URL = 'https://www.google-analytics.com/mp/collect';
const GTM_CLIENT_ID_COOKIE = '_ga';

function extractSessionValue(sessionId = '') {
	const parts = sessionId.split?.('.') || '';
	return parts.length >= 3 ? parts[2] : null;
}

export async function GtmMeasurementProtocolService({
	leadId,
	products,
	documentNumber,
}) {
	const clientId =
		cookies()
			.get(GTM_CLIENT_ID_COOKIE)
			?.value?.replace?.('GA1.1.', '')
			?.replace?.('GA1.3.', '') || '';

	const sessionId = extractSessionValue(
		cookies().get(
			`${GTM_CLIENT_ID_COOKIE}_${MEASUREMENT_ID?.replace('G-', '')}`,
		)?.value,
	);

	const userClientId = encryptValue(removeSpecialCharacters(documentNumber));
	const subProduct = products?.[0]?.category?.toLowerCase();
	const apiEndpoint = `${GTM_API_URL}?measurement_id=${MEASUREMENT_ID}&api_secret=${GTM_API_SECRET}`;

	const response = await fetch(apiEndpoint, {
		method: 'POST',
		body: JSON.stringify({
			client_id: clientId,
			user_id: userClientId,
			user_properties: {
				client_bcp: {
					value: '',
				},
				client_id: {
					value: userClientId,
				},
			},
			events: [
				{
					name: 'lead_mp',
					params: {
						ev_category:
							'hub-vendas:servico:aquisicao:servico-para-casa-e-auto',
						ev_action: 'lead:form-async:enviar:sucesso',
						ev_label: 'vinculo:nao',
						session_id: sessionId,
						timestamp: Date.now(),
						channel: 'hub-vendas',
						brand: 'porto',
						product: 'servico-para-casa-e-auto',
						subproduct: subProduct,
						vertical: 'servico',
						lead_id: leadId,
					},
				},
			],
		}),
	});

	try {
		if (!response.ok) {
			const errorText = await response.text();
			console.log(
				`Response error at GtmMeasurementProtocolService: Status ${response.status} - ${errorText}`,
			);
			return null;
		}

		return 'ok';
	} catch (e) {
		console.log('Error at GtmMeasurementProtocolService:', e);
		return null;
	}
}
