import type { Dispatch } from 'react';

import type { ActionProps, InitialStateProps } from '../reducer/types';

export type ModalReschedulingProps = {
	state: InitialStateProps;
	dispatch: Dispatch<ActionProps>;
	onSubmit: () => void;
};
