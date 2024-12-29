import React, { type HTMLAttributes } from 'react';

import './styles.scss';

export type RootProps = HTMLAttributes<HTMLDivElement> & {
	width?: string;
	height?: string;
	borderRadius?: string;
	marginTop?: string;
	marginBottom?: string;
	marginLeft?: string;
	marginRight?: string;
	display?: 'flex' | 'block';
	flexDirection?: 'row' | 'column' | 'unset';
	gap?: string;
	bgColor?: string;
};

export const Root = ({
	width = 'unset',
	height = 'unset',
	borderRadius = '0.4rem',
	display = 'block',
	flexDirection = 'unset',
	marginTop = '0px',
	marginBottom = '0px',
	marginLeft = '0px',
	marginRight = '0px',
	gap,
	bgColor = 'none',
	children,
	...props
}: RootProps) => {
	return (
		<div
			className={`shimmer__root --bg-${bgColor}`}
			{...props}
			style={{
				width,
				height,
				borderRadius,
				display,
				flexDirection,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				gap,
			}}
		>
			{children}
		</div>
	);
};
