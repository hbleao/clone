import { Typography } from '@porto-ocean/typography';
import type { HTMLAttributes } from 'react';

import { Price } from '../Price';

interface FooterBarProps extends HTMLAttributes<HTMLDivElement> {
	totalPrice: string | number;
	legend: string;
	text?: string;
}

export const FooterBar = ({
	text = 'Total',
	totalPrice,
	legend,
	children,
	...rest
}: FooterBarProps) => (
	<>
		<div className="card-resume__footer" {...rest}>
			<Typography
				className="card-resume__service-footer-title"
				variant="title5"
				as="span"
			>
				{text}
			</Typography>
			<Price price={totalPrice} legend={legend} />
		</div>
		<div className="card-resume__footer-children">{children}</div>
	</>
);
