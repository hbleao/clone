
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

/**
 * Factory de validações para formulários.
 */
export const validators = {
	/**
	 * Validação de campo obrigatório.
	 * @param fieldName Nome do campo.
	 * @returns Instância de `RequiredFieldValidation`.
	 */
	required(fieldName: string): RequiredFieldValidation {
		return new RequiredFieldValidation(fieldName);
	},

	/**
	 * Validação de email.
	 * @param fieldName Nome do campo.
	 * @param errorMessage Mensagem de erro personalizada.
	 * @returns Instância de `EmailValidation`.
	 */
	email(fieldName: string, errorMessage?: string): EmailValidation {
		return new EmailValidation(fieldName, errorMessage);
	},

	/**
	 * Validação de comprimento mínimo.
	 * @param fieldName Nome do campo.
	 * @param errorMessage Mensagem de erro personalizada.
	 * @param validationValue Valor mínimo permitido.
	 * @returns Instância de `MinLengthValidation`.
	 */
	min(fieldName: string, errorMessage?: string, validationValue?: number): MinLengthValidation {
		return new MinLengthValidation(fieldName, errorMessage, validationValue);
	},

	/**
	 * Validação de valor mínimo.
	 * @param fieldName Nome do campo.
	 * @param errorMessage Mensagem de erro personalizada.
	 * @param validationValue Valor mínimo permitido.
	 * @returns Instância de `MinValueValidation`.
	 */
	minValue(
		fieldName: string,
		errorMessage?: string,
		validationValue?: number,
	): MinValueValidation {
		return new MinValueValidation(fieldName, errorMessage, validationValue);
	},

	/**
	 * Validação de comprimento máximo.
	 * @param fieldName Nome do campo.
	 * @param errorMessage Mensagem de erro personalizada.
	 * @param validationValue Valor máximo permitido.
	 * @returns Instância de `MaxLengthValidation`.
	 */
	max(
		fieldName: string,
		errorMessage?: string,
		validationValue?: number,
	): MaxLengthValidation {
		return new MaxLengthValidation(fieldName, errorMessage, validationValue);
	},

	/**
	 * Validação de CPF.
	 * @param fieldName Nome do campo.
	 * @param errorMessage Mensagem de erro personalizada.
	 * @returns Instância de `CPFValidation`.
	 */
	cpf(fieldName: string, errorMessage?: string): CPFValidation {
		return new CPFValidation(fieldName, errorMessage);
	},

	/**
	 * Validação de CNPJ.
	 * @param fieldName Nome do campo.
	 * @param errorMessage Mensagem de erro personalizada.
	 * @returns Instância de `CnpjValidation`.
	 */
	cnpj(fieldName: string, errorMessage?: string): CnpjValidation {
		return new CnpjValidation(fieldName, errorMessage);
	},

	/**
	 * Validação de CPF ou CNPJ.
	 * @param fieldName Nome do campo.
	 * @param errorMessage Mensagem de erro personalizada.
	 * @returns Instância de `CpfOrCnpjValidation`.
	 */
	cpfOrCnpj(fieldName: string, errorMessage?: string): CpfOrCnpjValidation {
		return new CpfOrCnpjValidation(fieldName, errorMessage);
	},
};
