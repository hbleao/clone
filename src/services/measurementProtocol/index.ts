'use server';

import { encryptValue } from '@/utils';
import { removeSpecialCharacters } from '@/validation/helpers';
import { env } from 'next-runtime-env';
import { cookies } from 'next/headers';

const MEASUREMENT_ID = env('NEXT_PUBLIC_GTM_MEASUREMENT_ID');
const GTM_API_SECRET = env('NEXT_PUBLIC_GTM_API_SECRET');
const GTM_API_URL = 'https://www.google-analytics.com/mp/collect';
const GTM_CLIENT_ID_COOKIE = '_ga';

interface GtmMeasurementProtocolServiceProps {
  leadId: string;
  products: { category: string }[];
  documentNumber: string;
}

function extractSessionValue(sessionId = '') {
  const parts = sessionId.split?.('.') || '';
  return parts.length >= 3 ? parts[2] : null;
}

function validateEnvVariables() {
  if (!MEASUREMENT_ID || !GTM_API_SECRET) {
    console.error('Missing environment variables for GTM Measurement Protocol');
    return false;
  }
  return true;
}

export async function GtmMeasurementProtocolService({
  leadId,
  products,
  documentNumber,
}: GtmMeasurementProtocolServiceProps): Promise<void> {
  if (!validateEnvVariables()) return;

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
  const subProduct = products?.[0]?.category?.toLowerCase() || '';
  const apiEndpoint = `${GTM_API_URL}?measurement_id=${MEASUREMENT_ID}&api_secret=${GTM_API_SECRET}`;

  try {
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
            name: 'generate_lead',
            params: {
              lead_id: leadId,
              session_id: sessionId,
              sub_product: subProduct,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Failed to send data to GTM Measurement Protocol:', response.statusText);
    }
  } catch (error) {
    console.error('Error in GtmMeasurementProtocolService:', error);
  }
}
