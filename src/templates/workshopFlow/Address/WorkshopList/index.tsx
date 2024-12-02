import { useUserStore } from '@/store';
import { Typography } from '@porto-ocean/typography';
import type React from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
	ActionProps,
	InitialStateProps,
	Workshop,
} from '../reducer/types';
import './style.scss';
import { WorkshopCard } from './WorkshopCard';
import { ShimmerWorkshopCard } from './WorkshopCard/Shimmer';

interface WorkshopListProps {
	state: InitialStateProps;
	isLoading: boolean;
	dispatch: React.Dispatch<ActionProps>;
}

export const WorkshopList: React.FC<WorkshopListProps> = ({
	isLoading,
	state,
	dispatch,
}) => {
	const { workshops, selectedWorkshop } = state;
	const { setWorkshopSelected } = useUserStore();

	function onSelectWorkshop(workshop: Workshop) {
		dispatch({
			type: 'setSelectedWorkshop',
			payload: workshop,
		});
		setWorkshopSelected(workshop);
	}

	return (
		<>
			<Typography as="h2" variant="body1">
				3. Escolha a oficina de sua preferência
			</Typography>
			<div className="workshop-list">
				{isLoading
					? Array.from({ length: 10 }, () => (
							<ShimmerWorkshopCard key={uuidv4()} />
						))
					: workshops.map((workshop) => (
							<WorkshopCard
								key={workshop.code}
								workshop={workshop}
								onSelect={onSelectWorkshop}
								isSelected={selectedWorkshop?.code === workshop.code}
								isLoading={false}
							/>
						))}
			</div>
		</>
	);
};
