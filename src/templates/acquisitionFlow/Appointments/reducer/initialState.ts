export const initialState = {
	selectedDate: {
		day: '',
		weekday: '',
		month: '',
		schedules: [],
		setDateTime: '',
		selected: false,
	},
	selectedHour: '',
	availableDays: [],
	isLoading: false,
	isEnableButton: false,
	isRequestError: false,
	requestStatus: {
		isSuccess: false,
		message: '',
		feedback: '',
	},
};
