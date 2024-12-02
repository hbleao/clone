export type IAddress = {
	street: string;
	neighborhood: string;
	city: string;
	state: string;
	stateCode: string;
	postalCode: string;
	latitude: number;
	longitude: number;
};

export type IEligibility = {
	coverage: boolean;
	initialValue: string;
	additionalNightValue: string;
	technicalVisitValue: string;
	kmValue: string;
	additionalValue: string;
	addressData: IAddress;
	statusCode?: number;
};
