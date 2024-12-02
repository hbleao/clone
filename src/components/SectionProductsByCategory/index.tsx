'use client';
import * as Chip from '@porto-ocean/chip';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import './styles.scss';

import { CustomIcons } from '@/constants';
import { Cards } from './Cards';

import { ServiceProductByCategory } from '@/services';

import { setDataLayerList, setDataLayerListError } from './setDataLayer';

import type { ICategory, IProduct } from '@/dtos';

import { getMaxHeight } from '@/utils';
import type { SectionProductsByCategoryProps } from './types';

export const SectionProductsByCategory = ({
	title,
	serviceGroup,
	allCategories,
}: SectionProductsByCategoryProps) => {
	const [maxHeight, setMaxHeight] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState('');

	const categories = allCategories?.filter(
		(category) => category.menu === serviceGroup,
	);

	const {
		data: products,
		isPending: isLoadingProducts,
		isError: isErrorProducts,
		mutateAsync: handleSelectCategory,
	} = useMutation({
		mutationKey: ['@mutation:selected-category'],
		mutationFn: async (category: string) => {
			setSelectedCategory(category);

			return await ServiceProductByCategory({
				value: category,
			});
		},
		onError: (error) =>
			setDataLayerListError({
				status: products?.status,
				message: error.message,
			}),
	});

	function checkVariant(category: string) {
		return category === selectedCategory ? 'selected' : 'default';
	}

	useEffect(() => {
		products?.data && setDataLayerList(products.data, title, selectedCategory);
		setMaxHeight(getMaxHeight('.section_products_by_category .card-main'));
	}, [products?.data]);

	return (
		<section className="section_products_by_category">
			<Grid>
				<Row>
					<div className="section_products_by_category__categories">
						<div className="section_products_by_category__title-container">
							<Typography
								as="h3"
								variant="title4"
								color="black75"
								weight="medium"
							>
								{title}
							</Typography>
						</div>
						<div className="section_products_by_category__categories-list">
							{categories?.length > 0 &&
								categories.map((category: ICategory, id: number) => (
									<div key={`${category.id}-${id}`}>
										<Chip.Root
											theme="light"
											variant={checkVariant(category.category)}
											onClick={() => handleSelectCategory(category.category)}
										>
											<CustomIcons iconName={category.icon} />
										</Chip.Root>
										<Chip.Text>{category.category}</Chip.Text>
									</div>
								))}
						</div>
					</div>
				</Row>
				<Cards
					maxHeight={maxHeight}
					sectionTitle={title}
					data={products?.data as IProduct[]}
					isLoading={isLoadingProducts}
					isError={isErrorProducts}
					refetchData={() => handleSelectCategory(selectedCategory)}
				/>
			</Grid>
		</section>
	);
};
