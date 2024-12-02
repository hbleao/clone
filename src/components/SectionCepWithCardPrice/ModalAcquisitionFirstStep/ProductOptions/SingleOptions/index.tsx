'use client';
import { Typography } from '@porto-ocean/typography';
import { useEffect, useState } from 'react';

import './styles.scss';

import { useUserStore } from '@/store';

import * as Radio from '@/components/Radio';
import { formatGtm, formattedPrice } from '@/utils';
import { formatOptionPriceToGtm } from '../../../../../utils/formatOptionPriceToGtm';

type TServiceOption = {
	selected: boolean;
	label: string;
	price: number;
};

export const SingleOptions = () => {
	const product = useUserStore((state) => state.user.product);
	const setProductUser = useUserStore((state) => state.setProductUser);
	const [serviceOptions, setServiceOptions] = useState<TServiceOption[]>([]);
	const allProducts = product.items;

	function updateSelectedService(selectedProduct) {
		const newService = serviceOptions.map((opt: Record<string, unknown>) => {
			return {
				...opt,
				selected: selectedProduct.label === opt.label,
			};
		}) as TServiceOption[];
		setServiceOptions(newService);
		setProductUser({
			...product,
			selectedItems: newService.filter(
				(service: {
					selected: boolean;
				}) => service.selected === true,
			),
			sku: selectedProduct.sku,
			cardPrice: {
				...product.cardPrice,
				price: selectedProduct.price,
			},
			companyCode: selectedProduct.companyCode,
			id: selectedProduct.id,
			originCode: selectedProduct.originCode,
			partnerProductId: selectedProduct.partnerProductId,
			problem: selectedProduct.problem,
			serviceTypeId: selectedProduct.serviceTypeId,
			sourceSystemCode: selectedProduct.sourceSystemCode,
			specialtyCode: selectedProduct.specialtyCode,
			subject: selectedProduct.subject,
		});
	}

	useEffect(() => {
		if (serviceOptions.length <= 0)
			setServiceOptions(
				allProducts?.map?.((opt) => ({
					...opt,
					selected: false,
				})) as unknown as TServiceOption[],
			);
	}, [product]);

	useEffect(() => {
		if (product?.selectedItems?.length) {
			updateSelectedService(product.selectedItems[0]);
		}
	}, []);

	return (
		<div className="single-options">
			{serviceOptions.map((option) => (
				<div
					key={option.label}
					className="single-options__service"
					onClick={() => updateSelectedService(option)}
					onKeyDown={() => updateSelectedService(option)}
					data-gtm-type="click"
					data-gtm-clicktype="input"
					data-gtm-name="selecione-opcao"
					data-gtm-subname={`${formatGtm(option.label)}-${formatOptionPriceToGtm(option.price)}`}
				>
					<div className="single-options__selection">
						<Typography variant="body2" as="span">
							{option.label}
						</Typography>
						<p className="single-options__price">
							{formattedPrice(option.price)}
						</p>
					</div>
					<Radio.Root variant={option.selected ? 'checked' : 'default'}>
						<Radio.Input />
					</Radio.Root>
				</div>
			))}
		</div>
	);
};
