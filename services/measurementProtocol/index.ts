
'use server';

import { encryptValue } from '@/utils';
import { removeSpecialCharacters } from '@/validation/helpers';
import { env } from 'next-runtime-env';
import { cookies } from 'next/headers';

const MEASUREMENT_ID = env('NEXT_PUBLIC_GTM_MEASUREMENT_ID');
const GTM_API_SECRET = env('NEXT_PUBLIC_GTM_API_SECRET');
const GTM_API_URL = 'https://www.google-analytics.com/mp/collect';
const GTM_CLIENT_ID_COOKIE = '_ga';

/**
 * Extrai o valor da sessão a partir do ID do cookie.
 * @param sessionId ID da sessão do cliente.
 * @returns Valor da sessão ou null se inválido.
 */
function extractSessionValue(sessionId: string = ''): string | null {
	const parts = sessionId.split('.');
	return parts.length >= 3 ? parts[2] : null;
}

/**
 * Serviço para enviar eventos ao Google Tag Manager Measurement Protocol.
 * @param leadId ID do lead gerado.
 * @param products Lista de produtos relacionados.
 * @param documentNumber Número do documento do usuário.
 * @returns 'ok' se a requisição foi bem-sucedida ou null em caso de erro.
 */
export async function sendEventToGtmMeasurementProtocol({
	leadId,
	products,
	documentNumber,
}: {
	leadId: string;
	products: Array<{ category?: string }>;
	documentNumber: string;
}): Promise<string | null> {
	// Obter o client_id do cookie
	const clientId =
		cookies()
			.get(GTM_CLIENT_ID_COOKIE)
			?.value?.replace?.('GA1.1.', '')
			?.replace?.('GA1.3.', '') || '';

	// Extrair o session_id do cookie
	const sessionId = extractSessionValue(
		cookies().get(
			`${GTM_CLIENT_ID_COOKIE}_${MEASUREMENT_ID?.replace('G-', '')}`,
		)?.value || '',
	);

	// Construir o user_id a partir do número do documento
	const userClientId = encryptValue(removeSpecialCharacters(documentNumber));

	// Extrair a subcategoria do produto
	const subProduct = products?.[0]?.category?.toLowerCase();

	// Construir a URL do endpoint
	const apiEndpoint = `${GTM_API_URL}?measurement_id=${MEASUREMENT_ID}&api_secret=${GTM_API_SECRET}`;

	// Construir o payload do evento
	const payload = {
		client_id: clientId,
		user_id: userClientId,
		user_properties: {
			client_bcp: { value: '' },
			client_id: { value: userClientId },
		},
		events: [
			{
				name: 'lead_mp',
				params: {
					ev_category: 'hub-vendas:servico:aquisicao:servico-para-casa-e-auto',
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
	};

	// Fazer a requisição ao endpoint
	try {
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`Response error at sendEventToGtmMeasurementProtocol: Status ${response.status} - ${errorText}`,
			);
			return null;
		}

		return 'ok';
	} catch (error) {
		console.error('Error at sendEventToGtmMeasurementProtocol:', error);
		return null;
	}
}
