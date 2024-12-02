import { CustomError } from '../../errors';
import type { FieldValidation } from '../../interface';

export class MinValueValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage = 'valor inválido',
		readonly minValue?: number,
	) {}

	validate(value: string): Error | null {
		return Number.parseFloat(value) >= this.minValue!
			? null
			: new CustomError(this.errorMessage);
	}
}
