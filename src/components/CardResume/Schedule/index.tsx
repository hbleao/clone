import { Icon } from '@porto-ocean/icon';
import { Typography } from '@porto-ocean/typography';
import type { HTMLAttributes } from 'react';

interface ScheduleProps extends HTMLAttributes<HTMLDivElement> {
	date: string;
}

export const Schedule = ({ date, ...rest }: ScheduleProps) => (
	<div className="card-resume__schedule" {...rest}>
		<Icon iconName="icon-porto-ic-calendar" />
		<Typography
			className="card-resume__service-caption"
			variant="caption"
			as="span"
		>
			{date}
		</Typography>
	</div>
);
