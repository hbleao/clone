import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import React from 'react';

import './styles.scss';

import { Link } from '@/components';

export type NotFoundTemplateProps = {
	button: {
		label: string;
		href: string;
	};
};

export const NotFoundTemplate = ({ button }: NotFoundTemplateProps) => {
	return (
		<section className="template-not-found">
			<Grid>
				<Row
					mobile={[1, 9]}
					landscape={[3, 11]}
					desktop={[3, 11]}
					wide={[3, 11]}
				>
					<div className="template-not-found__content">
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg
							width="36"
							height="36"
							viewBox="0 0 36 36"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0_8123_119686)">
								<path
									d="M18 24.9231C17.1692 24.9231 16.6154 24.3646 16.6154 23.5268V9.70393C16.6154 8.86618 17.1692 8.30768 18 8.30768C18.8308 8.30768 19.3846 8.86618 19.3846 9.70393V23.3872C19.3846 24.2249 18.8308 24.9231 18 24.9231Z"
									fill="#FF5A40"
								/>
								<path
									d="M29.7692 36H6.23077C5.12308 36 4.15385 35.7231 3.18462 35.1692C2.21538 34.6154 1.52308 33.9231 0.830769 32.9538C0.415385 32.1231 0 31.0154 0 30.0461C0 28.9385 0.138462 27.9692 0.692308 27L12.3231 3.46153C12.8769 2.35384 13.7077 1.52307 14.6769 0.969222C16.6154 -0.276932 19.2462 -0.276932 21.3231 0.969222C22.2923 1.52307 23.1231 2.4923 23.6769 3.46153L35.4462 26.8615C35.8615 27.8308 36.1385 28.9385 36.1385 29.9077C36.1385 31.0154 35.7231 31.9846 35.1692 32.9538C34.6154 33.9231 33.7846 34.6154 32.8154 35.1692C31.8462 35.7231 30.7385 36 29.7692 36ZM18 2.76922C17.3077 2.76922 16.7538 2.90768 16.2 3.32307C15.6462 3.59999 15.2308 4.15384 14.9538 4.70768L3.18462 28.1077C2.90769 28.6615 2.76923 29.2154 2.76923 29.9077C2.76923 30.4615 3.04615 31.1538 3.32308 31.5692C3.6 32.1231 4.01538 32.5385 4.56923 32.8154C5.12308 33.0923 5.67692 33.2308 6.23077 33.2308H29.6308C30.1846 33.2308 30.8769 33.0923 31.2923 32.8154C31.8462 32.5385 32.2615 32.1231 32.5385 31.5692C32.8154 31.0154 33.0923 30.4615 33.0923 29.9077C33.0923 29.3538 32.9538 28.6615 32.6769 28.1077L21.1846 4.70768C20.9077 4.15384 20.4923 3.59999 19.9385 3.32307C19.2462 2.90768 18.6923 2.76922 18 2.76922Z"
									fill="#FF5A40"
								/>
								<path
									d="M18 29.0769C17.2615 29.0769 16.6154 28.4308 16.6154 27.6923C16.6154 26.9538 17.2615 26.3077 18 26.3077C18.7385 26.3077 19.3846 26.9538 19.3846 27.6923C19.3846 28.4308 18.7385 29.0769 18 29.0769Z"
									fill="#FF5A40"
								/>
							</g>
							<defs>
								<clipPath id="clip0_8123_119686">
									<rect width="36" height="36" fill="white" />
								</clipPath>
							</defs>
						</svg>

						<Typography variant="title4" weight="bold">
							Ops, página não encontrada
						</Typography>
						<Typography variant="body1">
							Você pode fazer a sua busca em nossa página inicial.
						</Typography>
						<Link variant="insurance" href={button.href}>
							{button.label}
						</Link>
					</div>
				</Row>
			</Grid>
		</section>
	);
};
