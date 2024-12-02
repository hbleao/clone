type CardPrice = {
	oldPrice: number;
	benefitsText: string;
	discount: string;
	instalmentText: string;
	label: {
		color: string;
		text: string;
	};
	price: number;
	title: string;
	tag?: {
		text: string;
		textColor: string;
		bgColor: string;
	};
};

export type IProduct = {
	alias: string;
	name: string;
	cardPrice: CardPrice;
	categories: {
		category: string;
		subCategory: string;
	};
	description: string;
	image: {
		alt: string;
		src: string;
	};
	isNew: boolean;
	isOffer: boolean;
	link: {
		href: string;
		text: string;
		isRedirectLink: boolean;
	};
	sku: string;
	type: string;
	maxServices: number;
	partnerProductId: string;
	specialtyCode: string;
	problem: string;
	comboId: number;
	originCode: string;
	companyCode: string;
	items: {
		category: string;
		subCategory: string;
		label: string;
		descricao: string;
		id: number;
	}[];
};
