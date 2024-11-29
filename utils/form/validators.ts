import {
	CPFValidation,
	CnpjValidation,
	CpfOrCnpjValidation,
	EmailValidation,
	MaxLengthValidation,
	MinLengthValidation,
	MinValueValidation,
	RequiredFieldValidation,
} from '@/validation/validators';

export const validators: any = {
	required(fieldName: string) {
		return new RequiredFieldValidation(fieldName);
	},
	email(fieldName: string, errorMessage?: string) {
		return new EmailValidation(fieldName, errorMessage);
	},
	min(fieldName: string, errorMessage?: string, validationValue?: number) {
		return new MinLengthValidation(fieldName, errorMessage, validationValue);
	},
	minValue(fieldName: string, errorMessage?: string, validationValue?: number) {
		return new MinValueValidation(fieldName, errorMessage, validationValue);
	},
	max(fieldName: string, errorMessage?: string, validationValue?: number) {
		return new MaxLengthValidation(fieldName, errorMessage, validationValue);
	},
	cpf(fieldName: string, errorMessage?: string) {
		return new CPFValidation(fieldName, errorMessage);
	},
	cnpj(fieldName: string, errorMessage?: string) {
		return new CnpjValidation(fieldName, errorMessage);
	},
	cpfOrCnpj(fieldName: string, errorMessage?: string) {
		return new CpfOrCnpjValidation(fieldName, errorMessage);
	},
};
