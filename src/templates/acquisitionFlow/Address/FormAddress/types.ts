import type { Dispatch } from 'react';

import type { ActionProps, InitialStateProps } from '../reducer/types';

export type FormAddressProps = {
	state: InitialStateProps;
	dispatch: Dispatch<ActionProps>;
};
