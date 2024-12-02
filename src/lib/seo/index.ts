import type { Metadata } from 'next';

import { formatAemImageUrl } from '@/utils';

export async function getSEOData({ ...rest }): Promise<Metadata | object> {
	return {
		title: 'Porto Serviço - Assistência e serviços para Casa e Auto | Porto',
		description:
			'Serviços de assistência que são executados por prestadores altamente qualificados. Sempre que precisar para sua casa ou carro, conte com a Porto Serviço.',
		openGraph: {
			type: 'website',
			url: 'https://portoseguro.com.br/servicos',
			title: 'Porto Serviço - Assistência e serviços para Casa e Auto | Porto',
			description:
				'Serviços de assistência que são executados por prestadores altamente qualificados. Sempre que precisar para sua casa ou carro, conte com a Porto Serviço.',
			siteName: 'Porto Seguro',
			images: [
				{
					url: formatAemImageUrl(
						'content/dam/nova-home/logos-home/logo-home-portoseguro.webp',
					),
				},
			],
		},
		...rest,
	};
}
