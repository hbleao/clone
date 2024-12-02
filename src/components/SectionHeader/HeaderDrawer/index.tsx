import { Button } from '@porto-ocean/button';
import * as Header from '@porto-ocean/header';
import { Icon } from '@porto-ocean/icon';
import Image from 'next/image';
import React, { useEffect } from 'react';

import { MenuNav } from '../MenuNav';

import { formatAemImageUrl } from '../../../utils/formatAemImageUrl';

export type HeaderDrawerProps = {
	isOpenMenu: boolean;
	links: any;
	categories: any;
	subcategory: any;
	selectedCategory: any;
	indexSubcategory: any;
	handleCategory: any;
	handleSubcategory: any;
};

export const HeaderDrawer = ({
	isOpenMenu,
	links,
	categories,
	subcategory,
	selectedCategory,
	indexSubcategory,
	handleCategory,
	handleSubcategory,
}: HeaderDrawerProps) => {
	function lockBodyScroll() {
		const body = document.querySelector('body');
		if (isOpenMenu) {
			body!.classList.add('no-scroll');
			return;
		}
		body!.classList.remove('no-scroll');
	}

	useEffect(() => {
		lockBodyScroll();
	}, [isOpenMenu]);

	return (
		<Header.Drawer isOpen={isOpenMenu}>
			<MenuNav menuLinks={links} />
			<Header.DrawerCategories>
				<Header.DrawerList>
					{categories.map((submenu: any, i: number) => (
						<Header.DrawerListItem
							key={`${submenu.label}-${i}`}
							onClick={() => handleCategory(submenu)}
						>
							<Header.DrawerListLabel>{submenu.label}</Header.DrawerListLabel>
							<Header.HeaderArrow />
						</Header.DrawerListItem>
					))}
				</Header.DrawerList>
			</Header.DrawerCategories>

			{!!selectedCategory.label && (
				<Header.DrawerCategory isOpen={!!selectedCategory.label}>
					<Header.DrawerCategoryHeader>
						<Button
							onClick={() => handleCategory({})}
							variant="insurance"
							styles="ghost"
							size="small"
						>
							<Header.HeaderArrow />
							Voltar
						</Button>
						{!!selectedCategory?.logo && (
							<Image
								src={formatAemImageUrl(selectedCategory.logo.image)}
								alt={selectedCategory.logo.alt}
								width={180}
								height={24}
							/>
						)}

						<Header.DrawerSubcategory>
							{selectedCategory.categories.map((category: any, i: number) => (
								<React.Fragment key={category.name}>
									{category?.name && (
										<Header.DrawerSubcategoryItem
											key={category?.name}
											onClick={() => handleSubcategory(i)}
											isSelected={i === indexSubcategory}
										>
											{category.name}
										</Header.DrawerSubcategoryItem>
									)}
								</React.Fragment>
							))}
						</Header.DrawerSubcategory>
					</Header.DrawerCategoryHeader>

					<Header.DrawerLine />

					<Header.DrawerSubcategoryList>
						{subcategory.links.map((link: any, i: number) => (
							<Header.DrawerSubcategoryListItem key={`${link.label}-${i}`}>
								{!!link.icon && (
									<Icon
										color="portoSeguros100"
										iconName={link.icon}
										size="text-sm"
									/>
								)}

								<a
									href={link.url}
									target={link.target}
									data-gtm-type="click"
									data-gtm-clicktype="submenu"
									data-gtm-subname={`${selectedCategory.label}:${link.label}`}
									data-gtm-name={subcategory.name!}
								>
									{link.label}
								</a>
							</Header.DrawerSubcategoryListItem>
						))}
					</Header.DrawerSubcategoryList>
				</Header.DrawerCategory>
			)}
		</Header.Drawer>
	);
};
