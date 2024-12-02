'use client';
import { Carousel } from '@porto-ocean/carousel';
import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';

import './styles.scss';

import { getCarouselSettings } from './carouselSettings';

import { formatAemImageUrl } from '@/utils';

import type { BannerCarouselProps } from './types';

export const BannerCarousel = ({ banners }: BannerCarouselProps) => {
	const isOnlyBanner = banners.length === 1;

	const settings = getCarouselSettings({
		dots: !isOnlyBanner,
	});

	return (
		<Carousel settings={settings} className="section-banner-carousel">
			{banners.map((banner) => (
				<div key={banner.title} className="section-banner-carousel__banner">
					<div className="section-banner-carousel__content">
						<Typography
							className="section-banner-carousel__title"
							variant="title4"
						>
							{banner.title}
						</Typography>
						<Typography
							className="section-banner-carousel__subtitle"
							variant="body1"
						>
							{banner.subtitle}
						</Typography>
					</div>

					<div className="section-banner-carousel__image">
						<Image
							src={formatAemImageUrl(banner.image.src)}
							alt={banner.image.alt}
							width={336}
							height={160}
							quality={75}
							priority
						/>
					</div>
				</div>
			))}
		</Carousel>
	);
};
