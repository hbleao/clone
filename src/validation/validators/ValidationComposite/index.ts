import type { FieldValidation, Validation } from '../../interface';

export class ValidationComposite implements Validation {
	constructor(private readonly validators: FieldValidation[]) {}

	static build(validators: FieldValidation[]): ValidationComposite {
		return new ValidationComposite(validators);
	}

	validate(fieldName: string, fieldValue: string): string {
		for (const validator of this.validators) {
			if (validator.field === fieldName) {
				const error = validator.validate(fieldValue);
				if (error) return error.message;
			}
		}
		return '';
	}
}
