'use client';

import * as BannerBody from '@porto-ocean/banner-body';
import { Button } from '@porto-ocean/button';
import { Grid } from '@porto-ocean/grid';
import { Icon } from '@porto-ocean/icon';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { ModalProductFilter } from './ModalProductFilter';
import './styles.scss';
import type { SectionBannerBodyProps } from './type';

import { formatAemImageUrl } from '@/utils';
import { formatGtm } from '@/utils/formatGtm';
import { setupDataLayer } from '@/utils/setupDataLayer';

export const SectionBannerBody = ({
	sectionTitle,
	marginBottom,
	bannerBody,
	textColor,
	position = 'right',
}: SectionBannerBodyProps) => {
	const [isOpenProductModal, setIsOpenProductModal] = useState(false);
	const hasBenefits = !!bannerBody.benefits?.length;
	const hasButton = !!bannerBody?.buttons?.length;

	function handleClick(url: string, target: string) {
		window.open(url, target);
	}

	function handleToggleProductModal() {
		setIsOpenProductModal((oldState) => !oldState);
	}

	useEffect(() => {
		setupDataLayer();
	}, []);

	return (
		<section
			className={`section-banner-body position-${position} ${marginBottom}`}
		>
			<Grid>
				<Row>
					{sectionTitle && (
						<div className="section-banner-body__title">
							<Typography as="h2" variant="title4" color="black75">
								{sectionTitle}
							</Typography>
						</div>
					)}

					<BannerBody.Root
						bgColor={bannerBody.bgColor}
						theme={bannerBody.theme}
					>
						{bannerBody?.image?.src && (
							<BannerBody.Image>
								<Image
									src={formatAemImageUrl(bannerBody.image.src)}
									alt={bannerBody.image.alt}
									width={500}
									height={280}
								/>
							</BannerBody.Image>
						)}
						<BannerBody.Content>
							{bannerBody.pretitle && (
								<BannerBody.Pretitle>{bannerBody.pretitle}</BannerBody.Pretitle>
							)}
							{bannerBody.title && (
								<BannerBody.Title>{bannerBody.title}</BannerBody.Title>
							)}
							{bannerBody.subtitle && (
								<BannerBody.Subtitle>{bannerBody.subtitle}</BannerBody.Subtitle>
							)}
							{hasBenefits && (
								<BannerBody.Benefits>
									{bannerBody.benefits?.map((benefit: any) => (
										<React.Fragment key={benefit.text}>
											<div className="banner-body__benefit">
												{benefit.iconName && (
													<Icon iconName={benefit.iconName} size="text-md" />
												)}
												<BannerBody.Text
													className={`banner-body__benefit__text banner-body__${textColor}`}
													dangerouslySetInnerHTML={{ __html: benefit.text }}
												/>
											</div>
										</React.Fragment>
									))}
								</BannerBody.Benefits>
							)}

							{hasButton && (
								<BannerBody.Buttons>
									{bannerBody?.buttons?.map?.((button) => (
										<Button
											key={button.label}
											onClick={() => {
												button.link
													? handleClick(button.link, button.target)
													: handleToggleProductModal();
												window.dataLayer.push({
													event: 'modal',
													action: 'open',
													name: 'todos-os-servicos',
												});
											}}
											styles={button.styles}
											variant={button.variant}
											width={button.width}
											data-gtm-type="click"
											data-gtm-clicktype="button"
											data-gtm-name={formatGtm(button.label)}
											data-gtm-subname={formatGtm(bannerBody.title)}
										>
											{button.label}
										</Button>
									))}
									{bannerBody.textNote && (
										<BannerBody.TextNote>
											{bannerBody.textNote}
										</BannerBody.TextNote>
									)}
								</BannerBody.Buttons>
							)}
						</BannerBody.Content>
					</BannerBody.Root>
				</Row>
				{isOpenProductModal && (
					<ModalProductFilter
						handleCloseModal={handleToggleProductModal}
						sectionTitle={bannerBody.title}
					/>
				)}
			</Grid>
		</section>
	);
};
