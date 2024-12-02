import { AEMService } from '@/services';
import { NotFoundTemplate } from '@/templates';

import { SectionFooter, SectionHeader } from '@/components';

export default async function NotFound() {
	const button = {
		label: 'Ir para a página inicial',
		href: '/',
	};

	const { sections } = await AEMService.getContent(
		'https://www.portoseguro.com.br/servicos.model.json',
	);

	const layout = {
		header: sections[0].component,
		footer: sections[12].component,
	};

	return (
		<>
			<SectionHeader {...layout.header} />
			<NotFoundTemplate button={button} {...layout} />;
			<SectionFooter {...layout.footer} />
		</>
	);
}
