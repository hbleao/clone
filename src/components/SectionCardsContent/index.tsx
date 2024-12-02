'use client';
import { Button } from '@porto-ocean/button';
import * as CardContent from '@porto-ocean/card-content';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import type { SectionCardsContentProps } from './types';

export const SectionCardsContent = ({
	sectionTitle,
	cardsContent,
}: SectionCardsContentProps) => {
	function handleRedirect(url: string, target: string) {
		if (typeof window === 'undefined') return;
		window.open(url, target);
	}

	return (
		<section className="section-cards-content margin-default">
			<Grid>
				<Row>
					<div className="section-cards-content__title">
						<Typography as="h2" variant="title4" color="black75">
							{sectionTitle}
						</Typography>
					</div>

					<div className="section-cards-content__cards">
						{cardsContent.map((cardContent) => (
							<CardContent.Root key={cardContent.title}>
								{cardContent.title && (
									<CardContent.Title
										as={cardContent.headingTag}
										variant="title6"
										weight="bold"
									>
										{cardContent.title}
									</CardContent.Title>
								)}

								{cardContent.description && (
									<CardContent.Description>
										{cardContent.description}
									</CardContent.Description>
								)}

								{cardContent?.button && (
									<CardContent.Buttons>
										<Button
											variant={cardContent.button.variant}
											styles={cardContent.button.styles}
											width={cardContent.button.width}
											onClick={() =>
												handleRedirect(
													String(cardContent?.button?.link),
													String(cardContent?.button?.target),
												)
											}
										>
											{cardContent.button.label}
										</Button>
									</CardContent.Buttons>
								)}
							</CardContent.Root>
						))}
					</div>
				</Row>
			</Grid>
		</section>
	);
};
