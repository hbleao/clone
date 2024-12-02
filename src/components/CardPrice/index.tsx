import { Icon } from '@porto-ocean/icon';
import { Typography } from '@porto-ocean/typography';

import './style.scss';

import { ShimmerCardPrice } from './Shimmer';

import { formattedPrice } from '@/utils';

import type { CardPriceProps } from './types';

export const CardPrice = ({
	oldPrice,
	title,
	price,
	label,
	discount,
	installments,
	benefitsText,
	iconName = 'icon-porto-ic-credit-card',
	labelColor = 'white',
	children,
}: CardPriceProps) => {
	return (
		<>
			{price ? (
				<div className="card-price">
					<div className="card-price__price">
						<Typography variant="body2" className="pretitle">
							{title}
						</Typography>
						<div className="price__box-old">
							{oldPrice && <p className="price__old">{oldPrice}</p>}
							{discount && <p className="price__discount">{discount}</p>}
						</div>

						<div className="price__box-new">
							<Typography
								variant="title4"
								weight="medium"
								className="price__new"
							>
								{formattedPrice(Number(price))}
							</Typography>
							{label?.text && (
								<p
									className={`price__label --color-${labelColor} --bg-${label.color}`}
								>
									{label.text}
								</p>
							)}
						</div>

						<p className="price__installments">{installments}</p>
					</div>

					{benefitsText && (
						<div className="benefits">
							{iconName && <Icon iconName={iconName} size="text-2xl" />}
							<p
								className="benefits__text"
								dangerouslySetInnerHTML={{ __html: benefitsText }}
							/>
						</div>
					)}
					{children}
				</div>
			) : (
				<ShimmerCardPrice />
			)}
		</>
	);
};
