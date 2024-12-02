import type { Metadata } from 'next';
import { env } from 'next-runtime-env';
import { notFound } from 'next/navigation';

import { getSEOData } from '@/lib/seo';

import { api } from '@/lib';
import { AEMService } from '@/services';
import { TemplatePdp } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
	const { data } = await AEMService.getContent(
		'https://www.portoseguro.com.br/servicos.model.json',
	);

	return getSEOData({ title: data?.title });
}

export default async function CategoryPage({ params }) {
	const contentPath = `${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/api/servicos/categoria/${params.pdp}`;

	const { sections } = await AEMService.getContent(
		'https://www.portoseguro.com.br/cartao-de-credito.model.json',
	);
	const mainSections = await api.get(contentPath);

	if (mainSections.status === 404) {
		return notFound();
	}

	const MainSectionWithToken = mainSections.data.map((section) => {
		if (section.name === 'section_cep_with_card_price') {
			return {
				name: section.name,
				component: {
					...section.component,
				},
			};
		}
		return section;
	});

	const layout = {
		header: sections[1].component,
		footer: sections[18].component,
	};

	return (
		<TemplatePdp
			sections={MainSectionWithToken}
			layout={layout}
			sku={params.pdp}
		/>
	);
}
