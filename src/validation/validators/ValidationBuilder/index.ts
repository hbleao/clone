import type { FieldValidation } from '../../interface';

import {
	BirthDateValidation,
	CPFValidation,
	CepValidation,
	CnpjValidation,
	CpfOrCnpjValidation,
	EmailValidation,
	MaxLengthValidation,
	MinLengthValidation,
	MinValueValidation,
	RequiredFieldValidation,
} from '..';

export class ValidationBuilder {
	private constructor(
		private readonly fieldName: string,
		private readonly validations: FieldValidation[] = [],
	) {}

	static field(fieldName: string): ValidationBuilder {
		return new ValidationBuilder(fieldName);
	}

	required(): ValidationBuilder {
		this.validations.push(new RequiredFieldValidation(this.fieldName));
		return this;
	}

	email(errorMessage?: string): ValidationBuilder {
		this.validations.push(new EmailValidation(this.fieldName, errorMessage));
		return this;
	}

	min(validationValue: number, errorMessage?: string): ValidationBuilder {
		this.validations.push(
			new MinLengthValidation(this.fieldName, errorMessage, validationValue),
		);
		return this;
	}

	minValue(validationValue: number, errorMessage?: string): ValidationBuilder {
		this.validations.push(
			new MinValueValidation(this.fieldName, errorMessage, validationValue),
		);
		return this;
	}

	max(validationValue: number, errorMessage?: string): ValidationBuilder {
		this.validations.push(
			new MaxLengthValidation(this.fieldName, errorMessage, validationValue),
		);
		return this;
	}

	cpf(errorMessage?: string): ValidationBuilder {
		this.validations.push(new CPFValidation(this.fieldName, errorMessage));
		return this;
	}

	cnpj(errorMessage?: string): ValidationBuilder {
		this.validations.push(new CnpjValidation(this.fieldName, errorMessage));
		return this;
	}

	cep(errorMessage?: string): ValidationBuilder {
		this.validations.push(new CepValidation(this.fieldName, errorMessage));
		return this;
	}

	birthDate(errorMessage?: string): ValidationBuilder {
		this.validations.push(
			new BirthDateValidation(this.fieldName, errorMessage),
		);
		return this;
	}

	cpfOrCnpj(errorMessage?: string): ValidationBuilder {
		this.validations.push(
			new CpfOrCnpjValidation(this.fieldName, errorMessage),
		);
		return this;
	}

	build(): FieldValidation[] {
		return this.validations;
	}
}
