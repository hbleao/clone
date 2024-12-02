import React, { type HTMLAttributes } from 'react';

interface BottomBarProps extends HTMLAttributes<HTMLDivElement> {}

export const BottomBar = ({ children, ...rest }: BottomBarProps) => (
	<div className="card-resume__bottom-bar" {...rest}>
		{children}
	</div>
);
