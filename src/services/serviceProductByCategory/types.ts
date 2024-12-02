export type ServiceProductByCategoryProps = {
	value: string;
};

export type ServiceProductByCategoryResult = {
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
	price: string;
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
