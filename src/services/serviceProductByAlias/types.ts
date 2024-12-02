export type ServiceProductByProductAliasProps = {
	value: string;
};

export type ServiceProductByProductAliasResult = {
	sourceSystemCode: string;
	serviceTypeId?: number;
	id?: number;
	alias: string;
	name: string;
	cardPrice: CardPrice;
	categories: Categories;
	description: string;
	image: Image;
	isNew: boolean;
	isOffer: boolean;
	link: string;
	sku: string;
	type: string;
	maxServices: number;
	partnerProductId: string;
	specialtyCode: string;
	problem: string;
	comboId: number;
	subject: string;
	originCode: string;
	companyCode: string;
	items: Item[];
};

type CardPrice = {
	oldPrice: number;
	benefitsText: string;
	discount: string;
	instalmentText: string;
	label: Label;
	price: number;
	title: string;
};

type Label = {
	color: string;
	text: string;
};

type Categories = {
	category: string;
	subCategory: string;
};

type Image = {
	alt: string;
	src: string;
};

type Item = {
	category: string;
	subCategory: string;
	label: string;
	descricao: string;
	id: number;
};
