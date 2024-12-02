import { produce } from 'immer';
import type { ActionProps, InitialStateProps } from './types';

function reducer(state: InitialStateProps, action: ActionProps) {
	switch (action.type) {
		case 'setWorkshops': {
			state.workshops = action.payload;
			return;
		}

		case 'setSelectedWorkshop':
			state.selectedWorkshop = action.payload;
			return;

		case 'setFieldValue': {
			if (!action.fieldName) return;
			if (action.fieldName === 'cep') {
				state.workshops = [];
				state.fields.lat = '';
				state.fields.lng = '';
			}
			state.fields[action.fieldName] = action.payload;

			return;
		}

		case 'setLatLng': {
			state.fields.lat = action.payload.lat;
			state.fields.lng = action.payload.lng;
			return;
		}

		case 'setAllFieldValue': {
			state.fields = {
				...state.fields,
				...action.payload,
			};
			return;
		}

		case 'setEnableButton': {
			state.isEnableButton = action.payload;
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

		default:
			return;
	}
}

export const addressReducer = produce(reducer);
