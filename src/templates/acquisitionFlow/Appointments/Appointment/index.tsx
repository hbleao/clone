'use client';
import * as Notification from '@porto-ocean/notification';
import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import { Days } from './Days';
import { Hours } from './Hours';

import type { AppointmentProps } from './types';

export const Appointment = ({
	title,
	subtitle,
	state,
	dispatch,
	isLoading,
	variant,
}: AppointmentProps) => {
	return (
		<div className="acquisition-flow-appointment">
			<div className="acquisition-flow-appointment__title">
				<Typography variant="title5" as="h2">
					{title}
				</Typography>
				<Typography variant="body1" as="h5">
					{subtitle}
				</Typography>
			</div>

			<Days
				isLoading={isLoading}
				state={state}
				dispatch={dispatch}
				variant={variant}
			/>

			<Hours isLoading={isLoading} state={state} dispatch={dispatch} />

			{variant !== 'caps' && (
				<Notification.Root
					variant="outlined"
					className="acquisition-flow-appointment__notification"
				>
					<Notification.Icon iconName="icon-porto-ic-residence" />
					<Notification.Content>
						<Notification.Title>Se você mora em condomínio</Notification.Title>
						<Notification.Description>
							Consulte as leis de silêncio e as regras de acesso aos
							prestadores.
						</Notification.Description>
					</Notification.Content>
				</Notification.Root>
			)}
		</div>
	);
};
