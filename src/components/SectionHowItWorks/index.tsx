'use client';
import * as CardIcon from '@porto-ocean/card-icon';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import { CustomIcons } from '@/constants';

import type { SectionHowItWorksProps } from './types';

export const SectionHowItWorks = ({
	sectionTitle,
	sectionDescription,
	cardIcons,
}: SectionHowItWorksProps) => {
	return (
		<section className="section-card-icon-side-by-side margin-default --bg-black05">
			<Grid>
				<Row>
					<Typography
						as="h2"
						variant="title4"
						color="black75"
						className="section-card-icon-side-by-side__title"
					>
						{sectionTitle}
					</Typography>
					{sectionDescription && (
						<Typography
							as="p"
							variant="body1"
							color="black75"
							className="section-card-icon-side-by-side__title"
						>
							{sectionDescription}
						</Typography>
					)}
					<div className="section-card-icon-side-by-side__container">
						{cardIcons.map((cardIcon) => (
							<div
								className="section-card-icon-side-by-side__content"
								key={cardIcon.iconName}
							>
								{cardIcon?.customIcon && (
									<CustomIcons iconName={cardIcon.customIcon} />
								)}
								{cardIcon.iconName && (
									<CustomIcons iconName={cardIcon.iconName} />
								)}
								<div className="section-card-icon-side-by-side__text">
									{cardIcon.pretitle && (
										<CardIcon.Pretitle>{cardIcon.pretitle}</CardIcon.Pretitle>
									)}
									<CardIcon.Title>{cardIcon.title}</CardIcon.Title>
									<CardIcon.Description variant="body1">
										{cardIcon.description}
									</CardIcon.Description>
								</div>
							</div>
						))}
					</div>
				</Row>
			</Grid>
		</section>
	);
};
