export interface Workshop {
	code: string;
	name: string;
	address: string;
	district: string;
	city: string;
	state: string;
	zipCode: string;
	macroRegions: string;
	areaCode: string;
	phone: string;
	companyName: string;
	taxId: string;
	workingSaturday: boolean;
	latitude: string;
	longitude: string;
	distance: string;
	email: string;
}

export type LatLng = {
	lat: string;
	lng: string;
};

export type ActionProps =
	| { type: 'setFieldValue'; fieldName: keyof Fields; payload: string }
	| { type: 'setAllFieldValue'; payload: Partial<Fields> }
	| { type: 'setErrors'; fieldName: keyof Fields; payload: string }
	| { type: 'resetErrors'; payload: Partial<Record<keyof Fields, string>> }
	| { type: 'setWorkshops'; payload: Workshop[] }
	| { type: 'setSelectedWorkshop'; payload: Workshop | null }
	| { type: 'setLatLng'; payload: LatLng }
	| { type: 'setEnableButton'; payload: boolean };

export type Fields = {
	cep: string;
	address: string;
	lat: string;
	lng: string;
	vehicleInfo: string;
};

export type InitialStateProps = {
	fields: Fields;
	errors: Partial<Record<keyof Fields, string>>;
	workshops: Workshop[];
	selectedWorkshop: Workshop | null;
	isEnableButton: boolean;
};
