'use client';
import { Row } from '@porto-ocean/row';

import { CardMain } from '@/components';

import { grid } from './grid';

import { CreateCustomGridReferenceBasedOnArraySize } from '@/utils';
import type { CardsProps } from './types';

export const Cards = ({ data, maxHeight, sectionTitle }: CardsProps) => {
	const listWithThePositionOfEachCard =
		CreateCustomGridReferenceBasedOnArraySize(data, grid);

	return (
		<>
			{data?.length &&
				data.map((product, index) => (
					<Row
						key={`${product.alias}-${index}`}
						{...listWithThePositionOfEachCard[index]}
					>
						<CardMain
							maxHeight={maxHeight}
							cardCategory="ofertas"
							cardPosition={index}
							sectionTitle={sectionTitle}
							sku={product.sku}
							image={{
								src: product.image.src,
								alt: product.image.alt,
							}}
							tag={product.cardPrice?.tag}
							title={product.title}
							description={product.description}
							labelPrice={product?.cardPrice?.title}
							price={product.cardPrice?.price}
							preTitle={product.categories?.category}
							instalmentText={product.cardPrice?.instalmentText}
							benefit={{
								iconName:
									product?.benefit?.iconName || 'icon-porto-ic-credit-card',
								title: product?.benefit?.title || '20% de desconto',
								description:
									product?.benefit?.description || 'com Cartão Porto Bank',
							}}
							link={{
								label: product.link.text,
								url: product.link.href,
							}}
						/>
					</Row>
				))}
		</>
	);
};
