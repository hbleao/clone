import { describe, expect, it } from 'vitest';
import type { AsyncFieldValidation } from './AsyncFieldValidation';

const mockAsyncValidation: AsyncFieldValidation = {
	field: 'email',
	validate: async (value: string) => {
		if (value.includes('@')) return null;
		return new Error('Invalid email');
	},
};

describe('AsyncFieldValidation', () => {
	it('deve validar corretamente um email válido', async () => {
		const result = await mockAsyncValidation.validate('test@example.com');
		expect(result).toBeNull();
	});

	it('deve retornar um erro para um email inválido', async () => {
		const result = await mockAsyncValidation.validate('invalid-email');
		expect(result).toEqual(new Error('Invalid email'));
	});
});
