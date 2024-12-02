export const initialState = {
	fields: {
		street: '',
		selectedState: {
			codigoEstado: 0,
			siglaEstado: '',
		},
		selectedCity: '',
		availableCities: [],
		filteredCities: [],
		availableStates: [],
		cep: '',
		cepList: [],
	},
	disabledFields: {
		city: true,
		button: true,
		street: true,
	},
	loadings: {
		city: false,
		state: false,
		street: false,
	},
	dropdowns: {
		city: false,
		state: false,
	},
	errors: {
		street: false,
		city: false,
		state: false,
	},
};
