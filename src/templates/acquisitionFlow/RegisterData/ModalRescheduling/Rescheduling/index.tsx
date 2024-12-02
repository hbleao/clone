'use client';
import * as Notification from '@porto-ocean/notification';
import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import { Days } from './Days';
import { Hours } from './Hours';

import type { ReschedulingProps } from './types';

export const Rescheduling = ({
	title,
	subtitle,
	state,
	dispatch,
	isLoading,
}: ReschedulingProps) => {
	return (
		<div className="acquisition-flow-rescheduling__container">
			<div className="acquisition-flow-rescheduling__title">
				<Typography variant="title5" as="h2">
					{title}
				</Typography>
				<Typography variant="body1" as="h5">
					{subtitle}
				</Typography>
			</div>

			<Days isLoading={isLoading} state={state} dispatch={dispatch} />

			<Hours isLoading={isLoading} state={state} dispatch={dispatch} />

			<Notification.Root
				variant="outlined"
				className="acquisition-flow-rescheduling__notification"
			>
				<Notification.Icon iconName="icon-porto-ic-residence" />
				<Notification.Content>
					<Notification.Title>Importante</Notification.Title>
					<Notification.Description>
						No caso de condomínios não deixe de consultar as leis de silêncio e
						as regras de acesso aos prestadores.
					</Notification.Description>
				</Notification.Content>
			</Notification.Root>
		</div>
	);
};
