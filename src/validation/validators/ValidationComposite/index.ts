import type { FieldValidation, Validation } from '../../interface';

export class ValidationComposite implements Validation {
	constructor(private readonly validators: FieldValidation[]) {}

	static build(validators: any[]): ValidationComposite {
		return new ValidationComposite(validators);
	}

	validate(fieldName: string, fieldValue: string): string {
		const validators = this.validators.filter(
			(validator) => validator.field === fieldName,
		);

		for (const validator of validators) {
			const error = validator.validate(fieldValue);
			if (error) return error.message;
		}

		return '';
	}
}
