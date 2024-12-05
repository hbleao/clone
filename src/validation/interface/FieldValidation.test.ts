import { describe, expect, it } from 'vitest';
import type { FieldValidation } from './FieldValidation';

const mockValidation: FieldValidation = {
	field: 'username',
	validate: (value: string) => {
		if (value.length >= 3) return null;
		return new Error('Username too short');
	},
};

describe('FieldValidation', () => {
	it('deve validar corretamente um username válido', () => {
		const result = mockValidation.validate('validUser');
		expect(result).toBeNull();
	});

	it('deve retornar um erro para um username muito curto', () => {
		const result = mockValidation.validate('ab');
		expect(result).toEqual(new Error('Username too short'));
	});
});
