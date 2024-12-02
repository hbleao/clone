import { joinClasses } from '@porto-ocean/utils';

import './styles.scss';

import type { LabelProps } from './types';

export const Label = ({
	className = '',
	children,
	...restProps
}: LabelProps) => {
	return (
		<label
			htmlFor="label"
			className={joinClasses(['checkbox__label', String(className)])}
			{...restProps}
		>
			{children}
		</label>
	);
};
