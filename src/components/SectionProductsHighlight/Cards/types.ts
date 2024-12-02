export type HighlightServiceResult = {
	alias: string;
	cardPrice: CardPrice;
	categories: Categories;
	description: string;
	id: number;
	image: Image;
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

export type CardPrice = {
	discount: string;
	instalmentText: string;
	label: Label;
	price: number;
	title: string;
};

export type Label = {
	color: string;
	text: string;
};

export type Categories = {
	category: string;
	subCategory: string;
};

export type Image = {
	alt: string;
	src: string;
};

export type CardsProps = {
	sectionTitle: string;
	maxHeight: number;
	data: any[];
};
