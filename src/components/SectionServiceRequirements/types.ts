export type ServiceRequirements = {
	title: string;
	caption: string;
	icon: string;
	details: {
		content: string;
		notification: {
			icon: string;
			title: string;
			description: string;
		};
	};
};

export type SectionServiceRequirementsProps = {
	title: string;
	requirements: ServiceRequirements[];
	variant?: 'fluid' | 'default';
};
