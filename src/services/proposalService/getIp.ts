
'use server';

import { headers } from 'next/headers';

const DEFAULT_IP_ADDRESS = '127.0.0.1';

/**
 * Obtém o endereço IP do cliente a partir dos cabeçalhos HTTP.
 * @returns O endereço IP como uma string.
 */
export async function getClientIp(): Promise<string> {
	const header = headers();
	const forwardedFor = header.get('x-forwarded-for')?.replace('::1', '');

	if (forwardedFor) {
		const ipList = forwardedFor.split(',');
		return ipList[0]?.trim() || DEFAULT_IP_ADDRESS;
	}

	return header.get('x-real-ip') || DEFAULT_IP_ADDRESS;
}
