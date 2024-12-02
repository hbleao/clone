'use client';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import { useEffect, useState } from 'react';

import './styles.scss';

import { Cards } from './Cards';

import { formatGtm, getMaxHeight } from '@/utils';

import type { SectionProductsHighlightProps } from './types';

export const SectionProductsHighlight = ({
	sectionTitle,
	marginBottom,
	highlights,
}: SectionProductsHighlightProps) => {
	const [maxHeight, setMaxHeight] = useState(0);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.dataLayer = window.dataLayer || [];
		setMaxHeight(getMaxHeight('.section-products-highlight .card-main'));

		highlights?.length > 0 &&
			window.dataLayer.push({
				event: 'view_item_list',
				ev_action: 'ecommerce:visualizar:lista-produtos:sucesso',
				ev_detail: `categoria:${formatGtm(sectionTitle)}`,
				items: highlights.map((product) => ({
					item_id: product.sku,
					item_name: 'servicos-para-casa-e-auto',
					item_category: product.alias,
					item_brand: 'porto',
					item_variant: 'ofertas',
					item_list_name: `${formatGtm(sectionTitle)}:${product.alias}`,
					price: product.cardPrice?.price,
					quantity: 1,
					affiliation: 'porto',
				})),
			});
	}, [highlights]);

	return (
		<section
			id={formatGtm(sectionTitle)}
			className={`section-products-highlight margin-default ${marginBottom}`}
		>
			<Grid>
				<Row>
					<div className="section-products-highlight__title">
						<Typography
							as="h2"
							variant="title4"
							color="black75"
							weight="medium"
						>
							{sectionTitle}
						</Typography>
					</div>
				</Row>
				<Cards
					data={highlights}
					sectionTitle={sectionTitle}
					maxHeight={maxHeight}
				/>
			</Grid>
		</section>
	);
};
