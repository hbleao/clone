export type ActionProps = {
	type:
		| 'setFieldValue'
		| 'setLoadingValue'
		| 'setDisabledField'
		| 'setDropdownField'
		| 'setErrors';
	fieldName?: any;
	payload?: any;
};

export type keyValueProps = {
	[key: string]: any;
};

export interface InitialStateProps {
	fields: {
		street: string;
		selectedState: {
			codigoEstado: number;
			siglaEstado: string;
		};
		selectedCity: string;
		availableCities: any[];
		filteredCities: any[];
		availableStates: any[];
		cep: string;
		cepList: any[];
	};
	disabledFields: {
		city: boolean;
		street: boolean;
		button: boolean;
	};
	loadings: {
		city: boolean;
		state: boolean;
		street: boolean;
	};
	dropdowns: {
		city: boolean;
		state: boolean;
	};
	errors: {
		street: boolean;
		city: boolean;
		state: boolean;
	};
}
