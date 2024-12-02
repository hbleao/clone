import { CustomError } from '../../errors/CustomError';
import type { FieldValidation } from '../../interface';

export class BirthDateValidation implements FieldValidation {
	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	validate(value: string): Error | null {
		if (value) {
			const parts = value.split('/');
			if (parts.length !== 3) {
				return new CustomError(this.errorMessage);
			}
			const now = new Date();
			const currentYear = now.getFullYear();
			const year = Number.parseInt(parts[2], 10);
			const month =
				parts[1][0] === '0'
					? Number.parseInt(parts[1][1], 10)
					: Number.parseInt(parts[1], 10);
			const day =
				parts[0][0] === '0'
					? Number.parseInt(parts[0][1], 10)
					: Number.parseInt(parts[0], 10);

			if (year >= currentYear) {
				return new CustomError(this.errorMessage);
			}
			if (currentYear - year < 18 || currentYear - year > 80) {
				return new CustomError('Idade menor 18 ou maior que 80');
			}
			if (month < 1 || month > 12) {
				return new CustomError(this.errorMessage);
			}
			if (day < 1 || day > 31) {
				return new CustomError(this.errorMessage);
			}
			return null;
		}
		return new CustomError('Campo Obrigatório');
	}
}
