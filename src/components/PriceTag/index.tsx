import './styles.scss';

import { Typography } from '@porto-ocean/typography';

import { joinClasses } from '@porto-ocean/utils';

type TPriceTag = {
	variant?: string;
	className?: string;
	label?: string;
	bgColor?: string;
	textColor?: any;
};

export const PriceTag = ({
	className = '',
	bgColor = 'white',
	textColor,
	variant,
	label,
}: TPriceTag) => (
	<div
		className={joinClasses([
			'price-tag',
			`--bg-${bgColor}`,
			className,
			`--${variant}`,
		])}
	>
		<Typography as="span" variant="caption" weight="bold" color={textColor}>
			{label}
		</Typography>
	</div>
);
