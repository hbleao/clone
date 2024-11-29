'use server';

import { env } from 'next-runtime-env';

import type { AvailableDate } from './type';

export async function WorkshopScheduleService({
	code,
}): Promise<AvailableDate[]> {
	const response = await fetch(
		`${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/api/caps/workshop/${code}/schedule`,
	);

	if (!response.ok) {
		throw new Error(
			`Error fetching workshop code [${code}]: ${response.status} ${response.statusText}`,
		);
	}

	if (response.status === 200) {
		const data = await response.json();
		return data;
	}

	return [];
}
