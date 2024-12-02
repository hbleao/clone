import type { InitialStateProps } from './types';

export const initialState: InitialStateProps = {
	fields: {
		cep: '',
		address: '',
		lat: '',
		lng: '',
		vehicleInfo: '',
	},
	errors: {
		cep: '',
		address: '',
		vehicleInfo: '',
	},
	workshops: [],
	selectedWorkshop: null,
	isEnableButton: false,
};
