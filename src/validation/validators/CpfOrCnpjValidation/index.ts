import type { FieldValidation } from '../../interface';
import { CnpjValidation } from '../CNPJ';
import { CPFValidation } from '../CPF';

export class CpfOrCnpjValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	validate(value: string): Error | null {
		const isCpf = value.length < 16;
		const filledField = value.length > 0;

		if (!filledField) return null;

		const cpf = new CPFValidation(this.field, 'CPF com valor inválido');
		const cnpj = new CnpjValidation(this.field, 'CNPJ com valor inválido');

		return isCpf ? cpf.validate(value) : cnpj.validate(value);
	}
}
