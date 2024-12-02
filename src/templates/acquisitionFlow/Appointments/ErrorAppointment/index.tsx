'use client';
import { Button } from '@porto-ocean/button';
import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import type { ErrorAppointmentProps } from './types';

export const ErrorAppointment = ({
	handleTryAgain,
	title,
	message,
	buttonLabel,
}: ErrorAppointmentProps) => {
	return (
		<div className="acquisition-flow-error">
			<Typography variant="title5">{title}</Typography>
			<Typography variant="body1">{message}</Typography>
			<Button
				variant="insurance"
				styles="primary"
				width="fluid"
				onClick={() => handleTryAgain?.()}
			>
				{buttonLabel}
			</Button>
		</div>
	);
};
