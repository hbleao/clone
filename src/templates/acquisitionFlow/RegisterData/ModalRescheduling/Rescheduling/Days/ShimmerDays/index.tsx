import React from 'react';

import * as Shimmer from '@/components/Shimmer';

export const ShimmerDays = () => {
	return (
		<>
			{Array(12)
				.fill(0)
				.map((_, index) => (
					<Shimmer.Block
						key={`scheduling-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						width="50px"
						height="50px"
					>
						<Shimmer.Root />
					</Shimmer.Block>
				))}
		</>
	);
};
