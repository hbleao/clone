/* eslint-disable no-useless-escape */
import { CustomError } from '../../errors';
import {
	extractCheckDigits,
	isRepeatedNumbers,
	isValidLength,
	removeSpecialCharacters,
} from '../../helpers';
import type { FieldValidation } from '../../interface';
export class CPFValidation implements FieldValidation {
	private FACTOR_DIGIT_1 = 10;
	private FACTOR_DIGIT_2 = 11;

	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	calculateCheckDigit(cpf: string, factor: number): number {
		let totalSumDigits = 0;

		for (const digit of cpf) {
			if (factor > 1) totalSumDigits += Number.parseInt(digit) * factor--;
		}

		const rest = totalSumDigits % 11;
		return rest < 2 ? 0 : 11 - rest;
	}

	checkCPF(cpf: string): boolean {
		if (!cpf) return false;
		if (!isValidLength(cpf, 11)) return false;
		if (!isRepeatedNumbers(cpf, 11)) return false;

		const firstDigitChecker = this.calculateCheckDigit(
			cpf,
			this.FACTOR_DIGIT_1,
		);
		const secondDigitChecker = this.calculateCheckDigit(
			cpf,
			this.FACTOR_DIGIT_2,
		);

		const calculatedDigit = extractCheckDigits(cpf);
		const checkDigits = `${firstDigitChecker}${secondDigitChecker}`;
		return calculatedDigit === checkDigits;
	}

	validate(value: string): Error | null {
		const cpfWithoutSpecialCharacters = removeSpecialCharacters(value);
		return this.checkCPF(cpfWithoutSpecialCharacters)
			? null
			: new CustomError(this.errorMessage);
	}
}
