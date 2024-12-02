export type IScopeAndEligibility = {
	coverage?: boolean;
	statusCode: number;
	initialValue?: string;
	additionalNightValue?: string;
	technicalVisitValue?: string;
	kmValue?: string;
	additionalValue?: string;
	addressData?: {
		street?: string;
		city?: string;
		neighborhood?: string;
		postalCode?: string;
		stateCode?: string;
		state?: string;
		latitude: number;
		longitude: number;
	};
	message?: string;
	status?: string;
};
