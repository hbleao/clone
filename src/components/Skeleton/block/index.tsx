import React, { type HTMLAttributes } from 'react';

import './styles.scss';

export type BlockProps = HTMLAttributes<HTMLDivElement> & {
	width: string;
	height: string;
	borderRadius?: string;
	marginTop?: string;
	marginBottom?: string;
	marginLeft?: string;
	marginRight?: string;
	display?: 'flex' | 'block';
	flexDirection?: 'row' | 'column' | 'unset';
};

export const Block = ({
	width = '4.8rem',
	height = '4.8rem',
	borderRadius = '0.4rem',
	display = 'block',
	flexDirection = 'unset',
	marginTop = '0px',
	marginBottom = '0px',
	marginLeft = '0px',
	marginRight = '0px',
	...props
}: BlockProps) => {
	return (
		<div
			className="shimmer__block"
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
			}}
			{...props}
		/>
	);
};
