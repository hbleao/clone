import type { HTMLAttributes, ReactNode } from 'react';

import { joinClasses } from '@porto-ocean/utils';

type TContentProps = {
	children: ReactNode[] | ReactNode;
	variant?: 'top' | 'bottom' | 'left' | 'right';
} & HTMLAttributes<HTMLDivElement>;

export const Content = ({
	children,
	variant = 'left',
	className = '',
	...props
}: TContentProps) => {
	const variantClass = `--${variant}`;
	return (
		<div
			className={joinClasses([
				'tooltip__content',
				variantClass,
				String(className),
			])}
			{...props}
		>
			{children}
		</div>
	);
};
