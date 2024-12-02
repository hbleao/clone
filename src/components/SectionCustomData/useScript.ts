/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
'use client';

import { formatGtm } from '@/utils';
import { useEffect } from 'react';
declare global {
	interface Window {
		customData: any;
	}
}

const useScript = (
	pageName: string,
	product: string,
	vertical: string,
	subproduct: string,
	category: string,
	funnel?: string,
) => {
	useEffect(() => {
		if (typeof window === 'undefined') return;

		window.customData = {
			page: {
				name: pageName,
				porto_product: product,
				porto_subproduct: formatGtm(subproduct),
				category: category,
				vertical: vertical,
				funnel: funnel,
			},
			site: {
				portal: 'hub-vendas',
				versao: '1.2',
				marca: 'porto',
			},
			user: {
				product_login: 'sem-produto',
				user_id: '',
				logged: false,
				client_bcp: '',
			},
		};
	}, []);
};

export default useScript;
