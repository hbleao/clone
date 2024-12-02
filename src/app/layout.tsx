import { PublicEnvScript } from 'next-runtime-env';

import '@porto-ocean/css';
import '../assets/css/main.scss';
import '../assets/css/scrollable.scss';

import { getSEOData } from '@/lib/seo';
import type { Metadata } from 'next';

import { AEMService } from '@/services';

import { LayoutProvider } from '@/components';
import { GTM } from '@/lib/gtm';
import { VWO } from '@/lib/vwo';

export async function generateMetadata(): Promise<Metadata> {
	const { data } = await AEMService.getContent(
		'https://www.portoseguro.com.br/servicos.model.json',
	);

	return getSEOData({ title: data?.title });
}

export default function RootLayout(props) {
	return (
		<html lang="pt-BR">
			<head>
				<PublicEnvScript />
				<link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
				<VWO />
			</head>

			<body id="root">
				<LayoutProvider>{props.children}</LayoutProvider>
				<GTM />
			</body>
		</html>
	);
}
