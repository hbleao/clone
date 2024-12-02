import { Row } from '@porto-ocean/row';

import { Typography } from '@porto-ocean/typography';
import { ShimmerList } from './ShimmerList';

import { CardMain, ErrorPage } from '@/components';

import { grid } from './grid';

import type { CardsProps } from './types';

export const Cards = ({
	maxHeight,
	isLoading,
	isError,
	data,
	refetchData,
	sectionTitle,
}: CardsProps) => {
	const hasProducts = data?.length > 0;
	const serviceMessage =
		data?.length === 1 ? 'serviço disponível' : 'serviços disponíveis';

	if (isError) {
		return (
			<Row
				mobile={[1, 9]}
				portrait={[1, 9]}
				landscape={[1, 13]}
				desktop={[1, 13]}
			>
				<ErrorPage refetchData={refetchData} />
			</Row>
		);
	}

	return isLoading ? (
		<ShimmerList grids={grid} />
	) : (
		<>
			{hasProducts && (
				<Row style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
					<Typography variant="body2" weight="bold" color="black75">
						{data.length}
					</Typography>
					<Typography variant="body1" color="black75">
						{serviceMessage}
					</Typography>
				</Row>
			)}
			{data?.map((product, idx) => {
				return (
					<Row key={`${product.alias}-${idx}`} {...grid[idx]}>
						<CardMain
							maxHeight={maxHeight}
							sku={product.sku}
							cardPosition={idx}
							sectionTitle={sectionTitle}
							cardCategory={product.categories.category}
							image={{
								src: product.image.src,
								alt: product.image.alt,
							}}
							title={product.description}
							description={product?.description}
							benefit={{
								iconName: 'icon-porto-ic-credit-card',
								title: '20% de desconto',
								description: 'com Cartão Porto Bank',
							}}
							labelPrice={product.cardPrice.title}
							price={product.cardPrice.price}
							preTitle={product.categories.category}
							instalmentText={product.cardPrice.instalmentText}
							link={{
								label: product.link.text,
								url: product.link.href,
							}}
							tag={product.cardPrice.tag}
						/>
					</Row>
				);
			})}
		</>
	);
};
