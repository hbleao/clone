import type { ICategory, IProduct } from '@/dtos';

export type DefaultTemplateProps = {
	layout: {
		header: any;
		footer: any;
	};
	sections: {
		name: string | any;
		component: React.ReactNode;
	}[];
	className: string;
	token?: string;
	allCategories?: ICategory[];
	highlights?: { data: IProduct[]; status: number };
};
