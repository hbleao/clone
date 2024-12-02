import { Icon } from '@porto-ocean/icon';
import { Typography } from '@porto-ocean/typography';
import React, { type HTMLAttributes } from 'react';

interface AddressProps extends HTMLAttributes<HTMLDivElement> {
	address: string;
}

export const Address = ({ address, ...rest }: AddressProps) => (
	<div className="card-resume__address" {...rest}>
		<Icon iconName="icon-porto-ic-residence" />
		<Typography
			className="card-resume__service-caption"
			variant="caption"
			as="span"
		>
			{address}
		</Typography>
	</div>
);
