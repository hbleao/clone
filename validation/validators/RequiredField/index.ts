import { RequiredFieldError } from '../../errors';
import type { FieldValidation } from '../../interface';

export class RequiredFieldValidation implements FieldValidation {
	constructor(readonly field: string) {}

	validate(value: string): Error | null {
		return value ? null : new RequiredFieldError();
	}
}
