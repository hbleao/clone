import { describe, it, expect, vi } from 'vitest';
import { validators } from './validators';
import {
	CPFValidation,
	CnpjValidation,
	CpfOrCnpjValidation,
	EmailValidation,
	MaxLengthValidation,
	MinLengthValidation,
	MinValueValidation,
	RequiredFieldValidation,
} from '@/validation/validators';

describe('validators', () => {
	it('should return an instance of RequiredFieldValidation', () => {
		const fieldName = 'name';
		const result = validators.required(fieldName);

		expect(result).toBeInstanceOf(RequiredFieldValidation);
		expect(result.fieldName).toBe(fieldName);
	});

	it('should return an instance of EmailValidation', () => {
		const fieldName = 'email';
		const errorMessage = 'Invalid email';
		const result = validators.email(fieldName, errorMessage);

		expect(result).toBeInstanceOf(EmailValidation);
		expect(result.fieldName).toBe(fieldName);
		expect(result.errorMessage).toBe(errorMessage);
	});

	it('should return an instance of MinLengthValidation', () => {
		const fieldName = 'password';
		const errorMessage = 'Too short';
		const validationValue = 6;
		const result = validators.min(fieldName, errorMessage, validationValue);

		expect(result).toBeInstanceOf(MinLengthValidation);
		expect(result.fieldName).toBe(fieldName);
		expect(result.errorMessage).toBe(errorMessage);
		expect(result.validationValue).toBe(validationValue);
	});

	it('should return an instance of MinValueValidation', () => {
		const fieldName = 'age';
		const errorMessage = 'Too low';
		const validationValue = 18;
		const result = validators.minValue(fieldName, errorMessage, validationValue);

		expect(result).toBeInstanceOf(MinValueValidation);
		expect(result.fieldName).toBe(fieldName);
		expect(result.errorMessage).toBe(errorMessage);
		expect(result.validationValue).toBe(validationValue);
	});

	it('should return an instance of MaxLengthValidation', () => {
		const fieldName = 'username';
		const errorMessage = 'Too long';
		const validationValue = 12;
		const result = validators.max(fieldName, errorMessage, validationValue);

		expect(result).toBeInstanceOf(MaxLengthValidation);
		expect(result.fieldName).toBe(fieldName);
		expect(result.errorMessage).toBe(errorMessage);
		expect(result.validationValue).toBe(validationValue);
	});

	it('should return an instance of CPFValidation', () => {
		const fieldName = 'cpf';
		const errorMessage = 'Invalid CPF';
		const result = validators.cpf(fieldName, errorMessage);

		expect(result).toBeInstanceOf(CPFValidation);
		expect(result.fieldName).toBe(fieldName);
		expect(result.errorMessage).toBe(errorMessage);
	});

	it('should return an instance of CnpjValidation', () => {
		const fieldName = 'cnpj';
		const errorMessage = 'Invalid CNPJ';
		const result = validators.cnpj(fieldName, errorMessage);

		expect(result).toBeInstanceOf(CnpjValidation);
		expect(result.fieldName).toBe(fieldName);
		expect(result.errorMessage).toBe(errorMessage);
	});

	it('should return an instance of CpfOrCnpjValidation', () => {
		const fieldName = 'document';
		const errorMessage = 'Invalid document';
		const result = validators.cpfOrCnpj(fieldName, errorMessage);

		expect(result).toBeInstanceOf(CpfOrCnpjValidation);
		expect(result.fieldName).toBe(fieldName);
		expect(result.errorMessage).toBe(errorMessage);
	});
});
