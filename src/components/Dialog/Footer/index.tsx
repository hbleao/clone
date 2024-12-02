import type React from 'react';

import { joinClasses } from '@porto-ocean/utils';

type DialogFooterProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
	variant?: 'column' | 'row';
};

export const Footer = ({
	variant = 'row',
	className,
	...props
}: DialogFooterProps) => {
	const variantClassName = `--${variant}`;
	return (
		<div
			className={joinClasses([
				'dialog__footer',
				variantClassName,
				String(className),
			])}
			{...props}
		/>
	);
};
