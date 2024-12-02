import type { Dispatch } from 'react';

import type { ActionProps, InitialStateProps } from '../reducer/types';

export type FormRegisterDataProps = {
	state: InitialStateProps;
	dispatch: Dispatch<ActionProps>;
};
