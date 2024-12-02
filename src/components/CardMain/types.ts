export type CardMainProps = {
	maxHeight?: number;
	tag?: {
		text: string;
		textColor: string;
		bgColor: string;
	};
	image: {
		src: string;
		alt: string;
	};
	preTitle: string;
	title: string;
	description?: string;
	labelPrice: string;
	price: number;
	instalmentText: string;
	benefit?: {
		iconName: string;
		title: string;
		description: string;
	};
	link: {
		label: string;
		url: string;
	};
	sectionTitle: string;
	cardPosition: number;
	cardCategory: string;
	sku: string;
};
