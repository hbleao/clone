import { produce } from 'immer';

import type { ActionProps, InitialStateProps } from './types';

function reducer(state: InitialStateProps, action: ActionProps) {
	switch (action.type) {
		case 'setDate': {
			state.selectedDate = action.payload;
			state.selectedHour = '';
			return;
		}

		case 'setHour': {
			state.selectedHour = action.payload;
			return;
		}

		case 'setDateTime': {
			state.serviceDateTime = action.payload;
			return;
		}

		case 'setAvailableDays': {
			state.availableDays = action.payload;
			return;
		}

		case 'setIsLoading': {
			state.isLoading = action.payload;
			return;
		}

		case 'setEnableButton': {
			state.isEnableButton = !!state.selectedDate.day && !!state.selectedHour;
			return;
		}

		case 'setRequestMessage': {
			state.isLoading = false;
			state.requestStatus = {
				isSuccess: action.payload.success,
				message: action.payload.message,
				feedback: action.payload.feedback,
			};
			return;
		}

		case 'resetRequestMessageError': {
			state.isLoading = false;
			state.requestStatus = {
				isSuccess: false,
				message: '',
				feedback: '',
			};
			return;
		}

		case 'setRequestError': {
			state.errors = action.payload;
			return;
		}

		case 'setAppointmentUnavailable': {
			state.appointmentUnavailable = true;
		}
	}
}

export const appointmentsReducer = produce(reducer);
