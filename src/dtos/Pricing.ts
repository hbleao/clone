export type Ipricing = {
	products: [
		{
			id: number;
			sku: string;
			name: string;
			partnerId: number;
			productQuantity: number;
			comboId: number;
			items: ItemsProps[];
		},
	];
	paymentMethod: {
		portoCard: {
			installment: any;
		};
		otherCardBrands: {
			installment: any;
		};
	};
	quantity: number;
	discountValue?: string;
	initialValue: number;
	finalValuePortoCard: number;
	finalValue: number;
	couponStatus: 'not_provided' | 'invalid' | 'valid';
	tokenCommerceQuotation: string;
};

interface ItemsProps {
	id: number;
	description: string;
	quantity: number;
}
