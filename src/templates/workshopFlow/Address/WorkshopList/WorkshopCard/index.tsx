import { Radio } from '@/components';
import { joinClasses } from '@porto-ocean/utils';
import type React from 'react';
import type { Workshop } from '../../reducer/types';

import { Typography } from '@porto-ocean/typography';
import { ShimmerWorkshopCard } from './Shimmer';
import './style.scss';

interface WorkshopCardProps {
	workshop: Workshop;
	onSelect: (workshop: Workshop) => void;
	isSelected: boolean;
	isLoading: boolean;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
	workshop,
	onSelect,
	isSelected,
	isLoading,
}) => {
	if (isLoading) return <ShimmerWorkshopCard />;

	const colorSelected = isSelected ? 'portoSeguros100' : 'black75';

	return (
		<div
			className={joinClasses(['workshop-card', isSelected ? '--selected' : ''])}
		>
			<Radio.Root
				variant={isSelected ? 'checked' : 'default'}
				onClick={() => onSelect(workshop)}
				data-gtm-type="form"
				data-gtm-input="input"
				data-gtm-name="caps:oficina"
				data-gtm-subname="escolha-a-oficina-de-sua-preferencia"
			>
				<Radio.Input />
				<Radio.Label
					className="workshop-card__text"
					variant="body2"
					color={colorSelected}
				>
					<Typography
						variant="body1"
						as="p"
						weight="bold"
						color={colorSelected}
					>
						{workshop.name}
					</Typography>

					<Typography variant="body2" as="p" color={colorSelected}>
						{workshop.distance}
					</Typography>

					<Typography variant="body2" as="p" color={colorSelected}>
						{`${workshop.address}, ${workshop.district} - ${workshop.city}/${workshop.state}`}
					</Typography>
				</Radio.Label>
			</Radio.Root>
		</div>
	);
};
