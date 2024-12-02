export const initialState = {
	fields: {
		street: '',
		number: '',
		withoutNumber: false,
		complement: '',
		neighborhood: '',
		city: '',
		state: '',
	},
	isDefaultCep: false,
	isEnableButton: false,
	isOpenDialog: false,
	isLoading: false,
	errors: {
		street: '',
		number: '',
		complement: '',
		neighborhood: '',
		city: '',
		state: '',
	},
	requestStatus: {
		success: false,
		message: '',
		feedback: '',
	},
};
