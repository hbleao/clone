import type { IProduct } from '@/dtos';

export type SectionProductsHighlightProps = {
	sectionTitle: string;
	marginBottom?: string;
	highlights: IProduct[];
};
