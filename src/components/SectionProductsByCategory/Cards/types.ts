import type { IProduct } from '@/dtos';

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
	maxHeight?: number;
	sectionTitle: string;
	isLoading: boolean;
	isError: boolean;
	data: IProduct[];
	refetchData: () => void;
};
