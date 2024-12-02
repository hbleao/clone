import { Typography } from '@porto-ocean/typography';

import { joinClasses } from '@porto-ocean/utils';

import './styles.scss';

import type { LabelProps } from './types';

export const Label = ({
	className = '',
	children,
	...restProps
}: LabelProps) => {
	return (
		<Typography
			className={joinClasses(['radio__label', String(className)])}
			{...restProps}
		>
			{children}
		</Typography>
	);
};
