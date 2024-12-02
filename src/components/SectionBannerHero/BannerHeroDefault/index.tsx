'use client';
import * as BannerHero from '@porto-ocean/banner-hero';
import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';

import { Link } from '@/components';
import { useWindowSize } from '@porto-ocean/hooks';

import { formatAemImageUrl, formatGtm, textTruncate } from '@/utils';

import type { BannerHeroDefaultProps } from '../types';

export const BannerHeroDefault = ({
	bannerHero,
	marginBottom,
}: BannerHeroDefaultProps) => {
	const { width } = useWindowSize();
	const mobileVersion = width! < 767;
	const imageSize = mobileVersion ? { w: 300, h: 180 } : { w: 700, h: 400 };

	return (
		<BannerHero.Root
			className={`section-banner-hero ${marginBottom}`}
			theme="dark"
			bgColor={bannerHero.bgColor}
		>
			<BannerHero.Container className="banner-hero__grid">
				<BannerHero.Content
					portrait={[1, 5]}
					landscape={[1, 7]}
					desktop={[1, 7]}
					wide={[1, 7]}
				>
					{!!bannerHero.subTitle && (
						<Typography
							as="h3"
							variant="overline"
							color="white"
							className="subtitle-space"
							weight="bold"
						>
							{bannerHero.subTitle}
						</Typography>
					)}
					{!!bannerHero.title && (
						<Typography
							as="h2"
							variant="title2"
							color="white"
							className="title-space"
							weight="bold"
						>
							{textTruncate(bannerHero.title, 45)}
						</Typography>
					)}
					{!!bannerHero.description && (
						<Typography as="p" variant="body1" color="white">
							{textTruncate(bannerHero.description, 150)}
						</Typography>
					)}
					{bannerHero?.button && (
						<BannerHero.Buttons>
							<Link
								variant={bannerHero.button.variant}
								href={bannerHero.button.link}
								data-gtm-type="click"
								data-gtm-clicktype="banner-button"
								data-gtm-name={formatGtm(bannerHero.title)}
								data-gtm-subname="agende-agora:1"
							>
								{bannerHero.button.label}
							</Link>
						</BannerHero.Buttons>
					)}
				</BannerHero.Content>

				<BannerHero.Image>
					<Image
						src={formatAemImageUrl(bannerHero.image.src)}
						alt={bannerHero.image.alt}
						width={imageSize.w}
						height={imageSize.h}
						priority={true}
					/>
				</BannerHero.Image>
			</BannerHero.Container>
		</BannerHero.Root>
	);
};
