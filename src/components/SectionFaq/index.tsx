'use client';

import * as Accordion from '@porto-ocean/accordion';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import './styles.scss';

import { formatGtm } from '@/utils';

import type { SectionFaqProps } from './types';

export const SectionFaq = ({
	sectionTitle,
	questionsAndAnswers,
}: SectionFaqProps) => {
	const pathName = usePathname();
	const servico = pathName.split('/servicos/')[1];
	const servicoLimpo = servico ? formatGtm(servico.split('/')[0]) : null;

	const [accordions, setAccordions] = useState(
		questionsAndAnswers.map((acc) => ({
			...acc,
			isOpen: false,
		})),
	);

	const handleToggleAccordion = (index: number) => {
		const accordionsWithOnlyOneOpen = accordions.map((accordion, i) => ({
			...accordion,
			isOpen: i === index ? !accordion.isOpen : false,
		}));

		setAccordions(accordionsWithOnlyOneOpen);
	};

	return (
		<section className="section-faq margin-default">
			<Grid>
				<Row>
					<Typography
						as="h2"
						variant="title4"
						className="section-faq__title"
						color="black75"
					>
						{sectionTitle}
					</Typography>

					{accordions.map(({ title, isOpen, description }, i: number) => (
						<Accordion.Root key={title}>
							<Accordion.Trigger
								onClick={() => handleToggleAccordion(i)}
								data-gtm-type="click"
								data-gtm-clicktype="accordion-self"
								data-gtm-name={`porto-servico:${servicoLimpo}`}
								data-gtm-subname={`${formatGtm(title)}:${i + 1}`}
							>
								<Typography as="h3" variant="body1" weight="bold">
									{title}
								</Typography>
								<Accordion.Icon isOpen={isOpen} />
							</Accordion.Trigger>
							{isOpen && (
								<Accordion.Content
									dangerouslySetInnerHTML={{ __html: description }}
								/>
							)}
						</Accordion.Root>
					))}
				</Row>
			</Grid>
		</section>
	);
};
