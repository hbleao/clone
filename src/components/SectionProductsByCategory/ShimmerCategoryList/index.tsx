import React from 'react';

import { Shimmer } from '@/components';

export const ShimmerCategoryList = () => {
	return (
		<Shimmer.Root borderRadius="8px" display="flex" gap="3.2rem">
			<Shimmer.Block width="7.2rem" height="7.2rem" />
			<Shimmer.Block width="7.2rem" height="7.2rem" />
			<Shimmer.Block width="7.2rem" height="7.2rem" />
			<Shimmer.Block width="7.2rem" height="7.2rem" />
		</Shimmer.Root>
	);
};
