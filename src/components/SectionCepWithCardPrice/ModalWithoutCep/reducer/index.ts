import { produce } from 'immer';

import type { ActionProps, InitialStateProps } from './types';

function reducer(state: InitialStateProps, action: ActionProps) {
	switch (action.type) {
		case 'setFieldValue': {
			state.fields[action.fieldName] = action.payload;
			return;
		}
		case 'setLoadingValue': {
			state.loadings[action.fieldName] = action.payload;
			return;
		}
		case 'setDisabledField': {
			state.disabledFields[action.fieldName] = action.payload;
			return;
		}
		case 'setDropdownField': {
			state.dropdowns[action.fieldName] = action.payload;
			return;
		}

		case 'setErrors': {
			state.errors[action.fieldName] = action.payload;
			return;
		}
	}
}
export const withoutCepReducer = produce(reducer);
