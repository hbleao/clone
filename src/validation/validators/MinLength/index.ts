import { CustomError } from '../../errors';
import type { FieldValidation } from '../../interface';

export class MinLengthValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage = 'Valor inválido',
		readonly minLength?: number,
	) {}

	validate(value: string): Error | null {
		if (value.length < (this.minLength ?? 0)) {
			return new CustomError(this.errorMessage);
		}
		return null;
	}
}
