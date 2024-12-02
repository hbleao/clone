export type IProductFilter = any;

export interface CardPrice {
	title: string;
	price: number;
	instalmentText: string;
	discount: string;
	benefitsText: string;
	oldPrice: any;
	label: Label;
}

export interface Label {
	text: string;
	color: string;
}

export interface Categories {
	category: string;
	subCategory: string;
}

export interface Link {
	href: string;
	text: any;
	isRedirectLink: boolean;
}

export interface Image {
	alt: string;
	src: string;
}
