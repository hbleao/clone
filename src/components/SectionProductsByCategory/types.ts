import type { ICategory } from '@/dtos';

export type SectionProductsByCategoryProps = {
	title: string;
	serviceGroup: string;
	token: string;
	allCategories: ICategory[];
};

export type Products = {
	alias: string;
	cardPrice: {
		discount: string;
		instalmentText: string;
		label: {
			color: string;
			text: string;
		};
		price: number;
		title: string;
	};
	categories: {
		category: string;
		subCategory: string;
	};
	description: string;
	id: number;
	image: {
		alt: string;
		src: string;
	};
	isNew: boolean;
	isOffer: boolean;
	link: {
		text: string;
		href: string;
	};
	name: string;
	sku: string;
	type: string;
};
