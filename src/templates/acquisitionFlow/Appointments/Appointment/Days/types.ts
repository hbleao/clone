import type { Dispatch } from 'react';

import type { ActionProps, InitialStateProps } from '../../reducer/types';

export type DaysProps = {
	state: InitialStateProps;
	dispatch: Dispatch<ActionProps>;
	isLoading: boolean;
	variant?: 'default' | 'caps';
};
