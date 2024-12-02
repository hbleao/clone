import { Icon } from '@porto-ocean/icon';
import { Typography } from '@porto-ocean/typography';
import React, { type HTMLAttributes } from 'react';

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
	onToggle: () => void;
	open: boolean;
}

export const Header = ({ onToggle, ...rest }: HeaderProps) => (
	<div className="card-resume__header" {...rest}>
		<Typography className="card-resume__overline" variant="overline" as="h6">
			Resumo
		</Typography>
		<Icon iconName="icon-porto-ic-short-arrow-up" onClick={onToggle} />
	</div>
);
