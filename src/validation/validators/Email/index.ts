import { CustomError } from '../../errors';
import type { FieldValidation } from '../../interface';

export class EmailValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	validate(value: string): Error | null {
		if (!value) return new CustomError(this.errorMessage);

		const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i;
		return emailRegex.test(value) ? null : new CustomError(this.errorMessage);
	}
}
