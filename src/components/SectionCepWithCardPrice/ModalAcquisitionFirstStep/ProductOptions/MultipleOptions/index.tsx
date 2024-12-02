'use client';
import { Typography } from '@porto-ocean/typography';
import { useState } from 'react';

import './styles.scss';

import type { Option } from './type';

import { useUserStore } from '@/store';
import { formatGtm } from '@/utils';
import { formatOptionPriceToGtm } from '../../../../../utils/formatOptionPriceToGtm';

export const MultipleOptions = () => {
	const product = useUserStore((state) => state.user.product);
	const setProductUser = useUserStore((state) => state.setProductUser);
	const limit = product.maxServices;
	const items = product.items;
	const [selectedProducts, setSelectedProducts] = useState<Option[]>(
		product.selectedItems || [],
	);

	function addServiceChoice(option: Option): void {
		if (selectedProducts.length >= Number(limit)) return;
		setSelectedProducts([...selectedProducts, option]);
		setProductUser({
			...product,
			selectedItems: [...selectedProducts, option],
		});
	}

	function removeServiceChoice(option: Option) {
		const indexOption = selectedProducts
			.map((product) => product.label)
			.lastIndexOf(option.label);

		const newArray = selectedProducts.filter(
			(_, index) => index !== indexOption,
		);

		setSelectedProducts(newArray);
		setProductUser({ ...product, selectedItems: newArray });
	}

	function handleSelectedOption(option: Option): number {
		return selectedProducts.filter((opt) => opt.label === option.label).length;
	}

	function changeFieldBgColor(option: Option): string {
		const hasFiltered = handleSelectedOption(option) > 0;
		return hasFiltered ? '--bg-black05' : '--bg-white';
	}

	function changeButtonBgColor(option: Option): string {
		const hasFiltered = handleSelectedOption(option) > 0;
		return hasFiltered ? 'white' : '#F7F7F7';
	}

	function changeButtonFillColor(): string {
		return selectedProducts.length >= Number(limit) ? '#c8c8c8' : '#0046C0';
	}

	return (
		<div className="multiple-options">
			{items?.map?.((option) => (
				<div
					key={option.label}
					className={`multiple-options__service ${changeFieldBgColor(option)}`}
				>
					<Typography variant="body2">{option.label}</Typography>
					<div
						className="multiple-options__selection"
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:servicos"
						data-gtm-subname={`${formatGtm(product?.categories?.category)}-${formatOptionPriceToGtm(Number(option.price))}`}
					>
						{handleSelectedOption(option) > 0 && (
							<>
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="multiple-options__button-minus"
									onClick={() => removeServiceChoice(option)}
									onKeyDown={() => removeServiceChoice(option)}
								>
									<rect
										width="24"
										height="24"
										rx="12"
										fill={changeButtonBgColor(option)}
									/>
									<path
										d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
										fill="#0046C0"
									/>
								</svg>

								<span className="multiple-options__number">
									{handleSelectedOption(option)}
								</span>
							</>
						)}

						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="multiple-options__button-plus"
							onClick={() => addServiceChoice(option)}
							onKeyDown={() => addServiceChoice(option)}
						>
							<title>icon-arrow</title>
							<rect
								width="24"
								height="24"
								rx="12"
								fill={changeButtonBgColor(option)}
							/>
							<path
								d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
								fill={changeButtonFillColor()}
							/>
							<path
								d="M12 6C12.5523 6 13 6.44772 13 7L13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17L11 7C11 6.44771 11.4477 6 12 6Z"
								fill={changeButtonFillColor()}
							/>
						</svg>
					</div>
				</div>
			))}
		</div>
	);
};
