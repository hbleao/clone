import { produce } from 'immer';

import type { ActionProps, InitialStateProps } from './types';

function isValidFields(state: InitialStateProps): boolean {
	const errors = Object.values(state.errors);
	const hasErrors = errors.some((error) => error);

	return (
		!!state.fields.street &&
		(!!state.fields.number || state.fields.withoutNumber) &&
		!!state.fields.neighborhood &&
		!hasErrors
	);
}

function reducer(state: InitialStateProps, action: ActionProps) {
	switch (action.type) {
		case 'setFieldValue': {
			if (!action.fieldName) return;
			state.fields[action.fieldName] = action.payload;

			if (state.fields.withoutNumber) {
				state.fields.number = '';
			}

			return;
		}

		case 'setAllFieldValue': {
			state.fields = {
				...state.fields,
				...action.payload,
			};
			return;
		}

		case 'setIsCepDefault': {
			state.isDefaultCep = action.payload;
			return;
		}

		case 'toggleDialog': {
			state.isOpenDialog = !state.isOpenDialog;
			return;
		}

		case 'checkFieldsValidation': {
			state.isEnableButton = isValidFields(state);
			return;
		}

		case 'sendingFormInformation': {
			state.isLoading = true;
			return;
		}

		case 'showRequestMessageError': {
			state.isLoading = false;
			state.requestStatus = {
				success: action.payload.success,
				message: action.payload.message,
				feedback: action.payload.feedback,
			};
			return;
		}

		case 'resetRequestMessageError': {
			state.isLoading = false;
			state.requestStatus = {
				success: false,
				message: '',
				feedback: '',
			};
			return;
		}

		case 'setErrors': {
			if (!action.fieldName) return;
			state.errors[action.fieldName] = action.payload;
			return;
		}

		case 'resetErrors': {
			state.errors = action.payload;
			return;
		}
	}
}

export const addressFormReducer = produce(reducer);
