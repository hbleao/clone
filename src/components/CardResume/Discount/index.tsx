import { Typography } from '@porto-ocean/typography';
import React, { type HTMLAttributes } from 'react';

interface DiscountProps extends HTMLAttributes<HTMLDivElement> {
	discountText: string;
	discountValue: string;
}

export const Discount = ({
	discountText,
	discountValue,
	...rest
}: DiscountProps) => (
	<div className="card-resume__service-item-header" {...rest}>
		<Typography
			as="span"
			variant="caption"
			className="card-resume__service-discount"
		>
			{discountText}
		</Typography>
		<Typography
			as="span"
			variant="caption"
			className="card-resume__service-discount"
		>
			{discountValue}
		</Typography>
	</div>
);
