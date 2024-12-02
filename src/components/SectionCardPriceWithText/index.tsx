'use client';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';

import { CustomIcons } from '@/constants';
import { useUserStore } from '@/store';
import { useEffect } from 'react';
import { CardPrice } from '../CardPrice';
import './styles.scss';

export const SectionCardPriceWithText = ({
	title,
	description,
	price,
	benefits,
}: any) => {
	const { setProductUser } = useUserStore();

	useEffect(() => {
		setProductUser({
			cardPrice: {
				price,
				oldPrice: 200,
			},
		});
	}, [price]);

	return (
		<section className="section-card-price-text margin-default">
			<Grid>
				<Row desktop={[1, 7]}>
					<div className="section-card-price-text__container">
						<div className="section-card-price-text__text">
							<Typography
								as="h3"
								variant="title4"
								color="black75"
								weight="medium"
								className="section-card-price-text__title"
							>
								{title}
							</Typography>
							<div
								className="typography --body1 --color-black75 --font-weight-regular --font-style-normal section-card-price-text__description"
								dangerouslySetInnerHTML={{ __html: description }}
							/>
						</div>
					</div>
				</Row>
				<Row desktop={[7, 13]}>
					<CardPrice price={price} title="A partir de">
						<div className="section-card-price-text__benefits-container">
							{benefits.map((benefit) => (
								<div className="benefits" key={benefit.icon}>
									<CustomIcons iconName={benefit.icon} />
									<p
										className="benefits__text"
										dangerouslySetInnerHTML={{ __html: benefit.text }}
									/>
								</div>
							))}
						</div>
					</CardPrice>
				</Row>
			</Grid>
		</section>
	);
};
