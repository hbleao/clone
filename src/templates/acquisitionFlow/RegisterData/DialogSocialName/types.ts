import type { Dispatch } from 'react';

import type { ActionProps, InitialStateProps } from '../reducer/types';

export type DialogSocialNameProps = {
	state: InitialStateProps;
	dispatch: Dispatch<ActionProps>;
};
