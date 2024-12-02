import { Row } from '@porto-ocean/row';
import React from 'react';

import { Shimmer } from '@/components';

export type ShimmerListProps = {
	grid: {
		mobile: number[];
		portrait: number[];
		landscape: number[];
		desktop: number[];
	}[];
};

export const ShimmerProductList = ({ grid }: ShimmerListProps) => {
	return (
		<>
			{Array.from(grid).map((grid, i) => (
				<Row
					key={`${grid.mobile}-${i}`}
					className="card-shimmer__list"
					{...grid}
				>
					<Shimmer.Root borderRadius="8px" bgColor="black05">
						<Shimmer.Block width="100%" height="14rem" borderRadius="0px" />
						<Shimmer.Block
							width="10rem"
							height="2rem"
							marginTop="1rem"
							marginLeft="0.8rem"
						/>
						<Shimmer.Block
							width="22rem"
							height="2rem"
							marginTop="2.4rem"
							marginLeft="0.8rem"
						/>
						<Shimmer.Block
							width="18rem"
							height="2rem"
							marginTop="1rem"
							marginLeft="0.8rem"
						/>
						<Shimmer.Block
							width="20rem"
							height="2rem"
							marginTop="1rem"
							marginLeft="0.8rem"
						/>
						<Shimmer.Block
							width="240px"
							height="7rem"
							marginTop="2.4rem"
							marginLeft="0.8rem"
						/>
						<Shimmer.Block
							width="8rem"
							height="2rem"
							marginTop="1rem"
							marginBottom="1rem"
							marginLeft="0.8rem"
						/>
					</Shimmer.Root>
				</Row>
			))}
		</>
	);
};
