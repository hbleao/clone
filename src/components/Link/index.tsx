import { joinClasses } from '@porto-ocean/utils';
import NextLink from 'next/link';

import './styles.scss';

// biome-ignore lint/style/useImportType: <explanation>
import { LinkProps } from './types';

export const Link = ({
	variant = 'insurance',
	styles = 'primary',
	size = 'large',
	width = 'contain',
	href,
	disabled = '',
	className = '',
	children,
	...restProps
}: LinkProps) => {
	const custom_className = `link --${variant}-${styles} --${width} --${size}`;
	const disabledClass = disabled ? '--disabled' : '';

	return (
		<NextLink
			href={href}
			className={joinClasses([className, custom_className, disabledClass])}
			{...restProps}
		>
			{children}
		</NextLink>
	);
};
