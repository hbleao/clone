'use client';

import * as BannerHero from '@porto-ocean/banner-hero';
import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';

import { useDisclosure } from '@/hooks';
import { useUserStore } from '@/store';
import { formatAemImageUrl, formatGtm } from '@/utils';
import { useWindowSize } from '@porto-ocean/hooks';
import { truncateText } from '@porto-ocean/utils';
import { ModalServices } from './ModalServices';

export const BannerHeroCaps = ({ bannerHero, marginBottom }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { setProductUser } = useUserStore();
	const { width } = useWindowSize();
	const mobileVersion = width! < 767;
	const imageSize = mobileVersion ? { w: 300, h: 180 } : { w: 700, h: 400 };

	function handleOpenModal() {
		setProductUser({
			categories: {
				category: 'Serviço automativo',
				subCategory: bannerHero.title,
			},
		});
		onOpen();
	}

	return (
		<BannerHero.Root
			className={`section-banner-hero ${marginBottom}`}
			theme="dark"
			style={{ backgroundColor: bannerHero.bgColor }}
		>
			<ModalServices isOpen={isOpen} onClose={onClose} />
			<BannerHero.Container>
				<BannerHero.Content
					portrait={[1, 5]}
					landscape={[1, 7]}
					desktop={[1, 7]}
					wide={[1, 7]}
				>
					{!!bannerHero.logoIconRef && (
						<BannerHero.Logo>
							<Image
								src={formatAemImageUrl(bannerHero.logoIconRef)}
								alt="logo"
								width={180}
								height={20}
							/>
						</BannerHero.Logo>
					)}
					{!!bannerHero.subTitle && (
						<Typography as="h3" variant="title6">
							{bannerHero.subTitle}
						</Typography>
					)}
					{!!bannerHero.title && (
						<Typography as="h1" variant="title2" weight="bold">
							{truncateText(bannerHero.title, 45)}
						</Typography>
					)}
					{!!bannerHero.description && (
						<div
							className="typography --title6 --color-black100 --font-weight-regular --font-style-normal banner-hero__description"
							dangerouslySetInnerHTML={{ __html: bannerHero.description }}
						/>
					)}
					{!!bannerHero.ctaLabel && (
						<BannerHero.Button
							onClick={() => handleOpenModal()}
							data-gtm-type="click"
							data-gtm-clicktype="banner-hero-button"
							data-gtm-name={formatGtm(bannerHero.title)}
							data-gtm-subname="agende-agora:1 "
						>
							Agende agora
						</BannerHero.Button>
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
