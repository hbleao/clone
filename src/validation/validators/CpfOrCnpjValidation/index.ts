import type { FieldValidation } from '../../interface';
import { CnpjValidation } from '../CNPJ';
import { CPFValidation } from '../CPF';

export class CpfOrCnpjValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	validate(value: string): Error | null {
		if (!value) return null;

		const validator = value.length < 16
			? new CPFValidation(this.field, 'CPF com valor inválido')
			: new CnpjValidation(this.field, 'CNPJ com valor inválido');

		return validator.validate(value);
	}
}
