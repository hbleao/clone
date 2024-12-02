export type CardResumeProps = {
	isEnableButton: boolean;
	handleNextStep: (url: string) => void;
	isLoading?: boolean;
	scheduleState?: any;
};

export type CardResumeDefault = CardResumeProps & {
	variant?: 'default';
};

export type CardResumeCaps = CardResumeProps & {
	variant?: 'caps';
	isLoadingButton?: boolean;
};

export type TCardResume = CardResumeDefault | CardResumeCaps;
