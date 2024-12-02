import type { Dispatch } from 'react';

import type { ActionProps, InitialStateProps } from '../../reducer/types';

export type HoursProps = {
	isLoading: boolean;
	state: InitialStateProps;
	dispatch: Dispatch<ActionProps>;
};
