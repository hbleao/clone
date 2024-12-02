'use client';
import * as Accordion from '@porto-ocean/accordion';
import { Button } from '@porto-ocean/button';
import { Grid } from '@porto-ocean/grid';
import { Icon } from '@porto-ocean/icon';
import * as Modal from '@porto-ocean/modal';
import { Row } from '@porto-ocean/row';
import * as TextBody from '@porto-ocean/text-body';
import { Typography } from '@porto-ocean/typography';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { formatGtm } from '@/utils';
import './styles.scss';

export type SectionTermsOfUseProps = {
	title: string;
	text: string;
	button: {
		label: string;
	};
	modal: {
		title: string;
		content: any[];
	};
};

export const SectionTermsOfUse = ({
	title,
	text,
	button,
	modal,
}: SectionTermsOfUseProps) => {
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [accordions, setAccordions] = useState(
		modal.content.map((acc) => ({
			...acc,
			isOpen: false,
		})),
	);

	const pathname = usePathname();

	const handleToggleAccordion = (index: number) => {
		const accordionsWithOnlyOneOpen = accordions.map((accordion, i) => ({
			...accordion,
			isOpen: i === index ? !accordion.isOpen : false,
		}));

		setAccordions(accordionsWithOnlyOneOpen);
	};

	const servico = pathname?.split?.('/servicos/')?.at(-1) ?? null;

	return (
		<section className="section-terms-of-use margin-default">
			<Grid>
				<Row>
					<TextBody.Root>
						<Typography as="h2" variant="title4" color="black75">
							{title}
						</Typography>
						<TextBody.Text>{text}</TextBody.Text>
						<TextBody.Buttons>
							<Button
								styles="secondary"
								onClick={() => setIsOpenModal(true)}
								data-gtm-type="click"
								data-gtm-clicktype="button"
								data-gtm-name={`porto-servico:${servico}`}
								data-gtm-subname={`${servico}:${formatGtm(title)}:${formatGtm(button.label)}`}
							>
								{button.label}
							</Button>
						</TextBody.Buttons>
					</TextBody.Root>
				</Row>
			</Grid>

			{isOpenModal && (
				<>
					<Modal.Overlay />
					<Modal.Root>
						<Modal.Header>
							<Modal.ContentIconClose onClick={() => setIsOpenModal(false)}>
								<Icon size="text-md" iconName="icon-porto-ic-close" />
							</Modal.ContentIconClose>
							<div className="section-terms-of-use__modal">
								<Modal.ContentTitle>{modal.title}</Modal.ContentTitle>
							</div>
						</Modal.Header>
						<Modal.Body>
							<Modal.Content>
								{accordions.map((content: any, i: number) => (
									<Accordion.Root key={content.title}>
										<Accordion.Trigger onClick={() => handleToggleAccordion(i)}>
											<Typography as="h3" variant="body1">
												{content.title}
											</Typography>
											<Accordion.Icon isOpen={content.isOpen} />
										</Accordion.Trigger>
										{content.isOpen && (
											<Accordion.Content
												dangerouslySetInnerHTML={{
													__html: content.description,
												}}
											/>
										)}
									</Accordion.Root>
								))}
							</Modal.Content>
						</Modal.Body>
					</Modal.Root>
				</>
			)}
		</section>
	);
};
