import { Button } from '@porto-ocean/button';
import React from 'react';

import { Shimmer } from '@/components';
import './styles.scss';

export const ShimmerDesktop = () => {
	return (
		<Shimmer.Root
			borderRadius="8px"
			display="flex"
			flexDirection="column"
			gap="2rem"
		>
			<Shimmer.Block width="10.6rem" height="2rem" />
			<div className="shimmer-desktop">
				<div className="shimmer-desktop__category">
					<Shimmer.Block width="2rem" height="2rem" />
					<Shimmer.Block width="8rem" height="2rem" />
				</div>
				<div className="shimmer-desktop__price">
					<Shimmer.Block width="8rem" height="1.6rem" />
					<Shimmer.Block width="5rem" height="2rem" />
				</div>
				<div className="shimmer-desktop__items">
					<Shimmer.Block width="12rem" height="1.6rem" />
					<Shimmer.Block width="12rem" height="1.6rem" />
					<Shimmer.Block width="12rem" height="1.6rem" />
				</div>
				<Shimmer.Block width="18rem" height="1.6rem" />
				<Shimmer.Block width="17rem" height="1.6rem" />
			</div>
			<div className="card-resume__divisor" />
			<div>
				<Button
					onClick={() => {}}
					disabled={true}
					variant={'disabled'}
					width="fluid"
				/>
			</div>
		</Shimmer.Root>
	);
};
