'use client';
import { Button } from '@porto-ocean/banner-hero';
import * as CardContent from '@porto-ocean/card-content';
import { Carousel } from '@porto-ocean/carousel';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';

import { getCarouselOptions } from './carouselSettings';
import './styles.scss';

import { useWindowSize } from '@porto-ocean/hooks';
import { formatAemImageUrl } from '../../utils/formatAemImageUrl';

import type { SectionCardContentSideBySideProps } from './types';

export const SectionCardContentSideBySide = ({
	sectionTitle,
	cardsContent,
}: SectionCardContentSideBySideProps) => {
	const { width } = useWindowSize();
	const size = Number(width) > 768 ? { w: 250, h: 220 } : { w: 350, h: 320 };
	const { settings } = getCarouselOptions({
		cardNumber: cardsContent?.length,
	});

	function handleClick(link: string) {
		if (!link) {
			return;
		}
		if (typeof window !== 'undefined') {
		}
	}

	function handleRedirect(url: string, target: string) {
		if (typeof window === 'undefined') return;
		window.open(url, target);
	}

	return (
		<section className="section-card-content-side-by-side margin-default">
			<Grid>
				<Row>
					<div className="section-card-content-side-by-side__title">
						<Typography as="h2" variant="title4" color="black75">
							{sectionTitle}
						</Typography>
					</div>
				</Row>
				<Row>
					<Grid style={{ margin: '0' }} className="hide-on-mobile">
						<Row style={{ display: 'flex' }}>
							{cardsContent.map((card) => (
								<CardContent.Root
									className="hide-mouse-over"
									key={card.title}
									onClick={() => handleClick(String(card.link))}
								>
									<CardContent.Image className="card-content-image">
										<Image
											src={formatAemImageUrl(String(card?.image?.src))}
											alt={String(card?.image?.alt)}
											width={size.w}
											height={size.h}
										/>
									</CardContent.Image>
									{card.title && (
										<Typography as="h3" variant="title5">
											{card.title}
										</Typography>
									)}
									{card.description && (
										<CardContent.Description>
											{card.description}
										</CardContent.Description>
									)}
									{card?.button && (
										<CardContent.Buttons>
											<Button
												variant={card.button.variant}
												styles={card.button.styles}
												width={card.button.width}
												onClick={() =>
													handleRedirect(
														String(card?.button?.link),
														String(card?.button?.target),
													)
												}
											>
												{card.button.label}
											</Button>
										</CardContent.Buttons>
									)}
								</CardContent.Root>
							))}
						</Row>
					</Grid>
					<Carousel settings={settings} className="hide-on-desktop">
						{cardsContent.map((card) => (
							<CardContent.Root
								key={card.title}
								onClick={() => handleClick(String(card?.link))}
							>
								<CardContent.Image className="card-content-image">
									<Image
										src={formatAemImageUrl(String(card?.image?.src))}
										alt={String(card?.image?.alt)}
										width={size.w}
										height={size.h}
									/>
								</CardContent.Image>
								{card.title && (
									<Typography as="h3" variant="title5">
										{card.title}
									</Typography>
								)}
								{card.description && (
									<CardContent.Description>
										{card.description}
									</CardContent.Description>
								)}

								{card?.button && (
									<CardContent.Buttons>
										<Button
											variant={card.button.variant}
											styles={card.button.styles}
											width={card.button.width}
											onClick={() =>
												handleRedirect(
													String(card?.button?.link),
													String(card?.button?.target),
												)
											}
										>
											{card.button.label}
										</Button>
									</CardContent.Buttons>
								)}
							</CardContent.Root>
						))}
					</Carousel>
				</Row>
			</Grid>
		</section>
	);
};
