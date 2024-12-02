export type ActionProps = {
	type:
		| 'setDate'
		| 'setHour'
		| 'setIsLoading'
		| 'setAvailableDays'
		| 'setEnableButton'
		| 'setRequestMessage'
		| 'setDateTime'
		| 'resetRequestMessageError'
		| 'setRequestError'
		| 'setAppointmentUnavailable';
	fieldName?: any;
	payload?: any;
};

export type keyValueProps = {
	[key: string]: any;
};

export type schedulesProps = {
	time: string;
	serviceDateTime: string;
};

export type Appointment = {
	day?: string;
	month?: string;
	schedules?: schedulesProps[];
	selected: boolean;
	weekday: string;
};

export type InitialStateProps = keyValueProps & {
	selectedDate: Appointment;
	selectedHour: string;
	availableDays: Appointment[];
	isRequestError: boolean;
	isLoading: boolean;
	appointmentUnavailable?: boolean;
	isEnableButton: boolean;
	requestStatus: {
		isSuccess: boolean;
		message: string;
		feedback: string;
	};
};
