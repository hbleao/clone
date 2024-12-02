import { MultipleOptions } from './MultipleOptions';
import { SingleOptions } from './SingleOptions';

export type ProductOptionsProps = {
	productType: string;
};

export const ProductOptions = ({ productType }: ProductOptionsProps) => {
	const products = {
		variant: <SingleOptions />,
		multiple: <MultipleOptions />,
	};

	return <div className="product-options">{products[productType]}</div>;
};
