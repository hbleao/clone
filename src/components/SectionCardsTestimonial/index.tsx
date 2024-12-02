'use client';
import * as CardTestimonial from '@porto-ocean/card-testimonial';
import { Carousel } from '@porto-ocean/carousel';
import { Grid } from '@porto-ocean/grid';
import { Icon } from '@porto-ocean/icon';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';

import { getCarouselOptions } from './carouselSettings';

import './styles.scss';

import type { SectionsCardsTestimonialProps } from './types';

export const SectionCardsTestimonial = ({
	sectionTitle,
	hasArrows,
	cards,
}: SectionsCardsTestimonialProps) => {
	const { settings } = getCarouselOptions({
		cardNumber: cards?.length,
		hasArrows,
		hasDots: cards.length > 4,
	});

	return (
		<section className="section-cards-testimonial margin-default">
			<Grid>
				<Row>
					<div className="section-cards-testimonial__title">
						<Typography as="h2" variant="title4" color="black75">
							{sectionTitle}
						</Typography>
					</div>

					<Carousel settings={settings}>
						{cards.map((card) => (
							<CardTestimonial.Root key={card.name}>
								<CardTestimonial.Content>
									<CardTestimonial.Header>
										<Icon
											iconName="icon-porto-ic-opening-quotes"
											size="text-md"
										/>
										<CardTestimonial.Text>{card.text}</CardTestimonial.Text>
										{card?.date && (
											<CardTestimonial.Date>{card.date}</CardTestimonial.Date>
										)}
									</CardTestimonial.Header>
								</CardTestimonial.Content>
								<div>
									{card?.name && (
										<CardTestimonial.Name>{card.name}</CardTestimonial.Name>
									)}
									{card?.service && (
										<CardTestimonial.Position>
											{card.service}
										</CardTestimonial.Position>
									)}
								</div>
							</CardTestimonial.Root>
						))}
					</Carousel>
				</Row>
			</Grid>
		</section>
	);
};
