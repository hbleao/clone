export type ActionProps = {
	type:
		| 'setFieldValue'
		| 'setAllFieldValue'
		| 'setIsCepDefault'
		| 'toggleDialog'
		| 'checkFieldsValidation'
		| 'setErrors'
		| 'resetErrors'
		| 'setRequestStatus'
		| 'sendingFormInformation'
		| 'showRequestMessageError'
		| 'resetRequestMessageError';
	fieldName?: any;
	payload?: any;
};

export type keyValueProps = {
	[key: string]: any;
};

export type InitialStateProps = keyValueProps & {
	fields: any;
	errors: any;
	isLoading: boolean;
	isOpenDialog: boolean;
	isDefaultCep: boolean;
	isEnableButton: boolean;
	requestStatus: {
		success: boolean;
		message: string;
		feedback: string;
	};
};
