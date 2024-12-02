import { Shimmer } from '@/components';

export const ShimmerCardPrice = () => {
	return (
		<Shimmer.Root borderRadius="8px" bgColor="black05">
			<Shimmer.Block
				width="10rem"
				height="2rem"
				marginTop="24px"
				marginLeft="24px"
			/>
			<Shimmer.Block
				width="16rem"
				height="3rem"
				marginTop="8px"
				marginLeft="24px"
			/>
			<Shimmer.Block
				width="12rem"
				height="2rem"
				marginTop="8px"
				marginLeft="24px"
			/>
			<Shimmer.Block
				width="91%"
				height="5rem"
				marginTop="24px"
				marginLeft="24px"
				marginBottom="24px"
			/>
		</Shimmer.Root>
	);
};
