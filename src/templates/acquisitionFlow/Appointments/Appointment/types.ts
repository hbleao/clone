import type { Dispatch } from 'react';

import type { ActionProps, InitialStateProps } from '../reducer/types';

export type AppointmentProps = {
	title: string;
	subtitle: string;
	state: InitialStateProps;
	dispatch: Dispatch<ActionProps>;
	isLoading: boolean;
	variant?: 'default' | 'caps';
};
