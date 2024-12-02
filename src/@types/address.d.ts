export type Address = {
	street: string;
	neighborhood: string;
	city: string;
	state: string;
	stateCode: string;
	postalCode: string;
	latitude: number;
	longitude: number;
};

export type Eligibility = {
	coverage: boolean;
	initialValue: string;
	additionalNightValue: string;
	technicalVisitValue: string;
	kmValue: string;
	additionalValue: string;
	addressData: IAddress;
	statusCode?: number;
};
