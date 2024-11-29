import { CustomError } from '../../errors';
import type { FieldValidation } from '../../interface';

export class MinLengthValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage = 'Valor inválido',
		readonly minLength?: number,
	) {}

	validate(value: string): Error | null {
		return value.length >= this.minLength!
			? null
			: new CustomError(this.errorMessage);
	}
}
