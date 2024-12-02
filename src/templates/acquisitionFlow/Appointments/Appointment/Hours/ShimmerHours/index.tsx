'use client';
import React from 'react';

import * as Shimmer from '@/components/Shimmer';

export const ShimmerHours = () => {
	return (
		<>
			{Array(6)
				.fill(0)
				.map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={index} className="single-options__service">
						<div className="single-options__selection">
							<Shimmer.Root>
								<Shimmer.Block
									width="10rem"
									height="2.4rem"
									borderRadius="0.4rem"
								/>
							</Shimmer.Root>
						</div>
						<div className="single-options__selection">
							<Shimmer.Root>
								<Shimmer.Block
									width="2.2rem"
									height="2.2rem"
									borderRadius="100%"
								/>
							</Shimmer.Root>
						</div>
					</div>
				))}
		</>
	);
};
