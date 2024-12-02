import type { IScheduling } from '@/dtos';

export type ActionProps = {
	type:
		| 'setFieldValue'
		| 'setUrl'
		| 'setReschedulingDate'
		| 'setReminderList'
		| 'setSelectedReminder'
		| 'setAllFieldValue'
		| 'setIsLoadingPricing'
		| 'setIsValidCoupon'
		| 'cleanCoupon'
		| 'checkEnableSubmitButton'
		| 'setDataQualityLoadingPhone'
		| 'setDataQualityLoadingEmail'
		| 'setDataQualityLoadingSocialName'
		| 'checkIsValidFields'
		| 'setIsLoadingRetryProposal'
		| 'setIsOpenDialog'
		| 'setIsOpenDialogError'
		| 'setIsOpenModal'
		| 'showModalRescheduling'
		| 'setRescheduling'
		| 'setIsLoadingRescheduling'
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

export type Option = {
	iconName: string;
	title: string;
	description: string;
	required: boolean;
	accepted: boolean;
	refused: boolean;
	acceptLabel: string;
	refuseLabel: string;
};

export type InitialStateProps = keyValueProps & {
	fields: any;
	url: string;
	reminderList: Option[];
	rescheduling: IScheduling[];
	selectedReschedulingDate: IScheduling;
	errors: any;
	isLoading: boolean;
	isLoadingPhone: boolean;
	isLoadingEmail: boolean;
	isShowModalRescheduling: boolean;
	isLoadingPricing: boolean;
	isLoadingSocialName: boolean;
	isEnableSubmitButton: boolean;
	isLoadingRetryProposal: boolean;
	isOpenDialog: boolean;
	isOpenDialogError: boolean;
	isOpenModal: boolean;
	isValidCoupon: boolean;
	requestStatus: {
		success: boolean;
		message: string;
		feedback: string;
	};
};
