export type Option = {
	category: string;
	subCategory: string;
	label: string;
	price?: string;
};

export type MultipleOptionsProps = {
	limitOfChoices: number;
	options: Option[];
	handleSelectedProducts: (products: Option[]) => any;
};
