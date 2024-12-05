import { CustomError } from '../../errors/CustomError';
import type { FieldValidation } from '../../interface';

export class CepValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	validate(value: string): Error | null {
		if (!value) {
			return new CustomError(this.errorMessage);
		}
		const onlyNumbers = value.replace(/\D/g, '');
		const isValidCep = /^[0-9]{8}$/.test(onlyNumbers);
		return isValidCep ? null : new CustomError(this.errorMessage);
	}
}
