import type { HeadingTypes } from '@porto-ocean/typography';
import type { HTMLAttributes } from 'react';

interface ServiceItemProps extends HTMLAttributes<HTMLUListElement> {
	items: string[];
	price: string | number;
	title: string;
	variant?: HeadingTypes;
}

export const ServiceItem = ({
	title,
	items,
	price,
	variant = 'body2',
	...rest
}: ServiceItemProps) => (
	<ul
		className={`card-resume__service-item typography --${variant} --color-black100 --font-weight-regular --font-style-normal`}
		{...rest}
	>
		{!!price && (
			<div className="card-resume__service-item-header">
				<span>{title}:</span>
				<span className="card-resume__service-price">{price}</span>
			</div>
		)}
		{items.map((item) => (
			<li key={item}>{item}</li>
		))}
	</ul>
);
