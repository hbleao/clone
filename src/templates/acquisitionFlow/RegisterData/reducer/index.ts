import { produce } from 'immer';

import type { ActionProps, InitialStateProps } from './types';

function isValidFields(state: InitialStateProps): boolean {
	const errors = Object.values(state.errors);
	const hasErrors = errors.some((error) => error);

	return (
		!!state.fields.cpf &&
		!!state.fields.email &&
		!!state.fields.fullName &&
		!!state.fields.phone &&
		(!!state.fields.socialName || !state.fields.hasSocialName) &&
		state.fields.acceptTerms &&
		!hasErrors
	);
}

function checkRemindersValidation(state: InitialStateProps) {
	const requiredReminders = state.reminderList.filter(
		(reminder) => reminder.required && !reminder.accepted,
	);

	const optionalReminders = state.reminderList.filter(
		(reminder) => !reminder.required && (reminder.accepted || reminder.refused),
	);

	return requiredReminders.length <= 0 && optionalReminders.length > 0;
}

function checkHasRefusedOption(state: InitialStateProps) {
	const requiredReminders = state.reminderList.filter(
		(reminder) => reminder.required && reminder.refused,
	);

	return requiredReminders.length > 0;
}

function reducer(state: InitialStateProps, action: ActionProps) {
	switch (action.type) {
		case 'setFieldValue': {
			if (!action.fieldName) return;
			state.fields[action.fieldName] = action.payload;

			if (!state.fields.hasSocialName) {
				state.fields.socialName = '';
			}

			return;
		}

		case 'setAllFieldValue': {
			state.fields = action.payload;
			return;
		}

		case 'checkEnableSubmitButton': {
			state.isEnableSubmitButton =
				isValidFields(state) && !state.isLoadingPricing;
			return;
		}

		case 'setIsLoadingPricing': {
			state.isLoadingPricing = action.payload;
			return;
		}

		case 'setUrl': {
			state.url = action.payload;
			return;
		}

		case 'showModalRescheduling': {
			state.isShowModalRescheduling = action.payload;
			return;
		}

		case 'setRescheduling': {
			state.rescheduling = action.payload;
			return;
		}

		case 'setReschedulingDate': {
			state.selectedReschedulingDate = action.payload;
			return;
		}

		case 'setReminderList': {
			state.reminderList = action.payload;
			return;
		}

		case 'checkIsValidFields': {
			state.errors = isValidFields(action.payload);
			return;
		}

		case 'cleanCoupon': {
			state.fields.coupon = '';
			return;
		}

		case 'setSelectedReminder': {
			const reminderListWithSelectedOption = state.reminderList.map(
				(reminder) => {
					if (reminder.description === action.payload.option.description) {
						const acceptedLabel = action.payload.inputType === 'acceptedLabel';
						return {
							...reminder,
							accepted: acceptedLabel && !reminder.accepted,
							refused: !acceptedLabel && !reminder.refused,
						};
					}

					return reminder;
				},
			);

			state.reminderList = reminderListWithSelectedOption;
			state.isEnableModalButton = checkRemindersValidation(state);
			state.refusedOption = checkHasRefusedOption(state);

			return;
		}

		case 'setIsOpenDialog': {
			state.isOpenDialog = action.payload;
			return;
		}

		case 'setIsValidCoupon': {
			state.isValidCoupon = action.payload;
			return;
		}

		case 'setIsOpenDialogError': {
			state.isOpenDialogError = action.payload;
			return;
		}

		case 'setIsOpenModal': {
			state.isOpenModal = action.payload;
			state.isEnableModalButton = checkRemindersValidation(state);
			return;
		}

		case 'sendingFormInformation': {
			state.isLoading = action.payload;
			return;
		}

		case 'setIsLoadingRetryProposal': {
			state.isLoadingRetryProposal = action.payload;
			return;
		}

		case 'setDataQualityLoadingPhone': {
			state.isLoadingPhone = action.payload;
			return;
		}

		case 'setDataQualityLoadingEmail': {
			state.isLoadingEmail = action.payload;
			return;
		}

		case 'setDataQualityLoadingSocialName': {
			state.isLoadingSocialName = action.payload;
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
			state.errors = {
				cep: '',
				fullName: '',
				socialName: '',
				phone: '',
				email: '',
				acceptTerms: '',
			};
			return;
		}
	}
}

export const registerFormReducer = produce(reducer);
