import * as Header from '@porto-ocean/header';
import Image from 'next/image';
import React from 'react';

import { formatAemImageUrl } from '../../../utils/formatAemImageUrl';

export type HeaderToolbarProps = {
	categories: any;
	subcategory: any;
	selectedCategory: any;
	indexSubcategory: any;
	handleCategory: any;
	handleSubcategory: any;
	hasSubcategories: any;
	handleRedirect: any;
};

export const HeaderToolbar = ({
	categories,
	subcategory,
	selectedCategory,
	indexSubcategory,
	handleCategory,
	handleSubcategory,
	hasSubcategories,
	handleRedirect,
}: HeaderToolbarProps) => {
	const hasCard = !!subcategory?.card?.image.url;
	const firstColumnLinks = getQuantityColumnsPerCategory(
		selectedCategory.quantityLinksPerColumn,
	);
	const lastColumnLinks = getQuantityColumnsPerCategory(
		selectedCategory.quantityLinksPerColumn * 2,
		selectedCategory.quantityLinksPerColumn,
	);

	function getQuantityColumnsPerCategory(lastIndex: number, initialIndex = 0) {
		if (!hasSubcategories) return [];

		return subcategory.links.slice(initialIndex, lastIndex);
	}

	return (
		<Header.Toolbar onMouseLeave={() => handleCategory({})}>
			{hasSubcategories && (
				<Header.TooltipOverlay onMouseEnter={() => handleCategory({})} />
			)}
			<Header.ToolbarList>
				{categories.map((category: any) => (
					<Header.ToolbarListItem
						tabIndex={0}
						key={category.label}
						onMouseEnter={() => handleCategory(category)}
						onFocus={() => handleCategory(category)}
						isSelected={selectedCategory.label === category.label}
					>
						<Header.ToolbarLabel>{category.label}</Header.ToolbarLabel>
						<Header.ToolbarIcon>
							<Header.HeaderArrow />
						</Header.ToolbarIcon>
					</Header.ToolbarListItem>
				))}
			</Header.ToolbarList>

			{hasSubcategories && (
				<Header.TooltipContainer>
					<Header.TooltipHeader>
						{!!selectedCategory?.logo?.image && (
							<Header.TooltipHeaderLogo
								href={selectedCategory.logo.url}
								target={selectedCategory.logo.target}
							>
								<Image
									src={formatAemImageUrl(selectedCategory.logo.image)}
									alt={selectedCategory.logo.alt}
									width={180}
									height={20}
								/>
							</Header.TooltipHeaderLogo>
						)}
						{selectedCategory.categories.map((category: any, index: number) => (
							<Header.TooltipHeaderCategory
								key={category.name}
								onClick={() => handleSubcategory(index)}
								isSelected={index === indexSubcategory}
							>
								{category.name}
							</Header.TooltipHeaderCategory>
						))}
					</Header.TooltipHeader>

					<Header.TooltipSeparator />

					<Header.TooltipContent>
						{hasSubcategories && (
							<React.Fragment>
								<Header.TooltipContentList>
									{firstColumnLinks.map((subcategory: any) => (
										<Header.TooltipContentListItem key={subcategory.label}>
											<a href={subcategory.url} target={subcategory.target}>
												{subcategory.label}
											</a>
											{subcategory.newLink && (
												<Header.TooltipContentListBadge>
													Novo
												</Header.TooltipContentListBadge>
											)}
										</Header.TooltipContentListItem>
									))}
								</Header.TooltipContentList>

								<Header.TooltipContentList>
									{lastColumnLinks.map((subcategory: any) => (
										<Header.TooltipContentListItem key={subcategory.label}>
											<a href={subcategory.url} target={subcategory.target}>
												{subcategory.label}
											</a>
											{subcategory.newLink && (
												<Header.TooltipContentListBadge>
													Novo
												</Header.TooltipContentListBadge>
											)}
										</Header.TooltipContentListItem>
									))}
								</Header.TooltipContentList>

								{hasCard && (
									<Header.TooltipCard
										image={formatAemImageUrl(subcategory.card.image.url)}
										onClick={() =>
											handleRedirect(
												subcategory.card!.link,
												subcategory.card!.target,
											)
										}
									>
										<Header.TooltipCardTitle>
											{subcategory.card.title}
										</Header.TooltipCardTitle>
										<Header.TooltipCardSubtitle>
											{subcategory.card.textButton}
										</Header.TooltipCardSubtitle>
									</Header.TooltipCard>
								)}
							</React.Fragment>
						)}
					</Header.TooltipContent>
				</Header.TooltipContainer>
			)}
		</Header.Toolbar>
	);
};
