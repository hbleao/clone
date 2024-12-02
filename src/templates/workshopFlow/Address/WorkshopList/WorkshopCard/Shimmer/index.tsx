import { Shimmer } from '@/components';

import '../style.scss';

export const ShimmerWorkshopCard = () => {
	return (
		<Shimmer.Root>
			<div className="workshop-skeleton">
				<div>
					<Shimmer.Block width="2.2rem" height="2.2rem" borderRadius="100%" />
				</div>
				<div className="workshop-skeleton__text">
					<Shimmer.Block width="29.2rem" height="2.4rem" borderRadius="4px" />
					<Shimmer.Block width="22rem" height="2rem" borderRadius="4px" />
					<Shimmer.Block width="17.6rem" height="1.6rem" borderRadius="4px" />
				</div>
			</div>
		</Shimmer.Root>
	);
};
