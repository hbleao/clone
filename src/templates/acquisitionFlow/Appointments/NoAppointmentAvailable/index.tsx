'use client';
import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import type { NoAppointmentAvailableProps } from './types';

export const NoAppointmentAvailable = ({
	handleRedirect,
	title,
	message,
	buttonLabel,
}: NoAppointmentAvailableProps) => {
	return (
		<div className="no-schedule-container">
			<Icon
				iconName="icon-porto-ic-calendar"
				size="text-5xl"
				color="portoSeguros100"
			/>
			<Typography variant="title5">{title}</Typography>
			<Typography variant="body1">{message}</Typography>
			<Button
				variant="insurance"
				styles="primary"
				width="fluid"
				onClick={() => handleRedirect()}
			>
				{buttonLabel}
			</Button>
		</div>
	);
};
