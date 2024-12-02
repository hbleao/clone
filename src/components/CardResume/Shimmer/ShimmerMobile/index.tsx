import React from 'react';

import { Shimmer } from '@/components';
import './styles.scss';

export const ShimmerMobile = () => {
	return (
		<Shimmer.Root borderRadius="8px" display="flex" gap="6.4rem">
			<div className="shimmer-mobile__button">
				<Shimmer.Block width="9.6rem" height="2.4rem" />
				<Shimmer.Block width="10.4rem" height="1.4rem" />
			</div>
			<Shimmer.Block width="15.2rem" height="4.8rem" />
		</Shimmer.Root>
	);
};
