import { CustomError } from '../../errors';
import type { FieldValidation } from '../../interface';

export class MinValueValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage = 'valor inválido',
		readonly minValue?: number,
	) {}

	validate(value: string): Error | null {
		const numericValue = Number.parseFloat(value);
		if (numericValue || numericValue < (this.minValue ?? 0)) {
			return new CustomError(this.errorMessage);
		}
		return null;
	}
}
