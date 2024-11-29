'use server';

import { headers } from 'next/headers';

const DEFAULT_IP_ADDRESS = '127.0.0.1';

export async function getIp() {
	const forwardedFor = headers().get('x-forwarded-for')?.replace('::1', '');

	if (forwardedFor) {
		return forwardedFor.split(',')[0] || DEFAULT_IP_ADDRESS;
	}

	return headers().get('x-real-ip') || DEFAULT_IP_ADDRESS;
}
