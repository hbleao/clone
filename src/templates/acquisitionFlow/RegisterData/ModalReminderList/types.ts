import type { Dispatch } from 'react';

import type { ActionProps } from '../reducer/types';

export type Option = {
	iconName: string;
	title: string;
	description: string;
	required: boolean;
	accepted: boolean;
	refused: boolean;
	acceptLabel: string;
	refuseLabel: string;
};

export type ModalReminderListProps = {
	url: string;
	title: string;
	subtitle: string;
	reminderList: Option[];
	isEnableButton: boolean;
	refusedOption: boolean;
	dispatch: Dispatch<ActionProps>;
	onNextStep: () => Promise<void>;
	isLoading?: boolean;
};
