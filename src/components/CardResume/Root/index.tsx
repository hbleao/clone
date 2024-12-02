import React, { type HTMLAttributes } from 'react';

interface RootProps extends HTMLAttributes<HTMLDivElement> {
	isOpen: boolean;
}

import '../styles.scss';

export const Root = ({ children, isOpen, ...rest }: RootProps) => (
	<div className={isOpen ? 'card-resume --open' : 'card-resume'} {...rest}>
		{children}
	</div>
);
