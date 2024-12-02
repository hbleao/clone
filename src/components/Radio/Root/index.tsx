import { joinClasses } from '@porto-ocean/utils';

import './styles.scss';

import type { RootProps } from './types';

export const Root = ({
	className = '',
	variant = 'default',
	children,
	...restProps
}: RootProps) => {
	return (
		<div
			className={joinClasses([
				'radio__root',
				`--${variant}`,
				String(className),
			])}
			{...restProps}
		>
			{children}
		</div>
	);
};
