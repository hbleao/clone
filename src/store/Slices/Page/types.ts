export type Step = {
	routeParam: string;
	label: string;
	stepNumber: number;
	nextLabe?: string;
	nextLink: string;
	backLink: string;
	modal?: {
		title: string;
		subtitle?: string;
		reminderList: {
			iconName: string;
			title: string;
			description: string;
			required: boolean;
			acceptLabel: string;
			refuseLabel: string;
			accepted: boolean;
			refused: boolean;
		}[];
	};
	tag?: {
		name: string;
		subname: string;
	};
};

export type Page = {
	steps: Step[];
};

export type PageProps = {
	page: Page;
	saveConfigPage: (page: Page) => void;
};
