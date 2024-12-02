import { CustomError } from '../../errors';
import type { FieldValidation } from '../../interface';

export class MaxLengthValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage = 'Valor inválido',
		readonly validationValue?: number,
	) {}

	validate(value: string): Error | null {
		return value.length <= this.validationValue!
			? null
			: new CustomError(this.errorMessage);
	}
}
