'use client';
import Image from 'next/image';

import './styles.scss';

import { Link } from '../Link';
import { PriceTag } from '../PriceTag';

import { formatGtm, formattedPrice, slugify, textTruncate } from '@/utils';

import { CustomIcons } from '@/constants';

import { useWindowDimension } from '@/hooks';

import type { CardMainProps } from './types';

export const CardMain = ({
	maxHeight,
	image,
	preTitle,
	title,
	description,
	labelPrice,
	price,
	instalmentText,
	link,
	tag,
	benefit,
	sectionTitle,
	cardPosition,
	cardCategory,
	sku,
}: CardMainProps) => {
	const { width } = useWindowDimension();
	const gtmSubName = `${formatGtm(cardCategory)}:${formatGtm(title)}:${cardPosition + 1}`;
	const isMobile = width < 768;

	function handleRedirect() {
		if (typeof window === 'undefined') return;

		window.dataLayer.push({
			event: 'select_item',
			ev_action: 'ecommerce:click:produto:sucesso',
			items: [
				{
					item_id: sku,
					item_name: formatGtm(sectionTitle),
					item_category: formatGtm(title),
					item_brand: 'porto',
					item_variant: formatGtm(cardCategory),
					item_list_name: `${formatGtm(sectionTitle)}:${formatGtm(cardCategory)}`,
					price: price,
					quantity: 1,
					affiliation: 'porto',
				},
			],
		});
	}

	return (
		<div
			className="card-main"
			style={{ height: `${Number(maxHeight) > 0 ? `${maxHeight}px` : 'auto'}` }}
		>
			{tag?.text && (
				<div className="card-main__price-tag">
					<PriceTag
						bgColor={tag?.bgColor}
						textColor={tag?.textColor}
						variant={slugify(tag.text)}
						label={tag.text}
					/>
				</div>
			)}
			<Image
				src={image.src}
				alt={image.alt}
				width={300}
				height={135}
				priority
				className="card-main__image"
			/>
			<div className="card-main__content">
				<div className="card-main__header">
					{preTitle && <span className="card-main__pretitle">{preTitle}</span>}
					{title && (
						<h2 className="card-main__title">{textTruncate(title, 140)}</h2>
					)}
					{description && (
						<p className="card-main__description">
							{textTruncate(description, 140)}
						</p>
					)}
				</div>
				<div className="card-main__body">
					<p className="card-main__label-price">{labelPrice}</p>
					{price && (
						<h3 className="card-main__price">{formattedPrice(price)}</h3>
					)}
					<p className="card-main__instalment-text">{instalmentText}</p>
					<div className="card-main__benefits">
						{!isMobile && benefit?.iconName && (
							<CustomIcons iconName={benefit?.iconName} />
						)}
						<div className="card-main__benefits-box">
							<span className="card-main__benefits-title">
								{benefit?.title}
							</span>
							<span className="card-main__benefits-description">
								{benefit?.description}
							</span>
						</div>
					</div>
					<Link
						width="full"
						size={isMobile ? 'small' : 'large'}
						href={link.url}
						onClick={handleRedirect}
						className="card-main__link"
						aria-label="card-link"
						rel="noreferrer"
						data-gtm-type="click"
						data-gtm-click-type="card-carousel-self"
						data-gtm-name={formatGtm(sectionTitle)}
						data-gtm-subname={gtmSubName}
					>
						{link.label}
					</Link>
				</div>
			</div>
		</div>
	);
};
