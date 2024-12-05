import { CustomError } from '../../errors';
import {
	extractCheckDigits,
	isRepeatedNumbers,
	isValidLength,
	removeSpecialCharacters,
} from '../../helpers';
/* eslint-disable no-useless-escape */
import type { FieldValidation } from '../../interface';

export class CnpjValidation implements FieldValidation {
	private factors: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	private FIRST_FACTOR = this.factors.slice(1, 13);
	private SECOND_FACTOR = this.factors;

	constructor(
		readonly field: string,
		readonly errorMessage?: string,
	) {}

	calculateCheckDigit(cnpj: string, factor: number[]): number {
		const listDigits = cnpj.split('');
		const totalSumDigits = listDigits.reduce((acc, currentValue, index) => {
			acc += Number(currentValue) * factor[index];
			return acc;
		}, 0);

		const quotient = totalSumDigits % 11;
		return quotient < 2 ? 0 : 11 - quotient;
	}

	checkCNPJ(cnpj: string): boolean {
		if (!cnpj || !isValidLength(cnpj, 14) || isRepeatedNumbers(cnpj, 14)) {
			return false;
		}

		const firstDigitChecker = this.calculateCheckDigit(cnpj.slice(0, 12), this.FIRST_FACTOR);
		const secondDigitChecker = this.calculateCheckDigit(cnpj.slice(0, 13), this.SECOND_FACTOR);
		const checkDigits = extractCheckDigits(cnpj);

		return checkDigits === `${firstDigitChecker}${secondDigitChecker}`;
	}

	validate(value: string): Error | null {
		const cnpjWithoutSpecialCharacters = removeSpecialCharacters(value);
		const digitChecker = this.checkCNPJ(cnpjWithoutSpecialCharacters);
		return digitChecker ? null : new CustomError(this.errorMessage);
	}
}
