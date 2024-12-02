import { CustomError } from '../../errors/CustomError';
import type { FieldValidation } from '../../interface';

export class CepValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	validate(value: string): Error | null {
		const onlyNumbers = value.replace(/\D/g, '');
		const emailRegex = /^[0-9]{8}$/;

		return !onlyNumbers || emailRegex.test(onlyNumbers)
			? null
			: new CustomError(this.errorMessage);
	}
}
