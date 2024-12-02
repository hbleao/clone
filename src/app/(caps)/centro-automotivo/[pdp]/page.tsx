import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { api, getSEOData } from '@/lib';
import { AEMService } from '@/services';
import { TemplatePdp } from '@/templates';
import { env } from 'next-runtime-env';

export async function generateMetadata(): Promise<Metadata> {
	const { data } = await AEMService.getContent(
		'https://www.portoseguro.com.br/centros-automotivos-porto-seguro.model.json',
	);

	return getSEOData({ title: data?.title });
}

export default async function CapsPDP({ params }) {
	try {
		const { sections } = await AEMService.getContent(
			'https://www.portoseguro.com.br/cartao-de-credito.model.json',
		);

		const mainSections = await api.get(
			`${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/pages/${params.pdp}.json`,
		);

		const layout = {
			header: sections[1].component,
			footer: sections[18].component,
		};

		const price = mainSections.data[2].component.price ?? 0;

		return (
			<TemplatePdp
				className="template-centro-automotivo"
				sections={mainSections.data}
				layout={layout}
				sku="workshop"
				price={price}
			/>
		);
	} catch (e) {
		console.error(e);
		return notFound();
	}
}
