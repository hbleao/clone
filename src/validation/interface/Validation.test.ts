import { describe, expect, it } from 'vitest';
import type { Validation } from './Validation';

class MockValidation implements Validation {
	validate(field: string, fieldValue: string): string {
		if (field === 'password' && fieldValue.length >= 6) {
			return '';
		}
		return 'Password too short';
	}
}

describe('Validation', () => {
	const validation = new MockValidation();

	it('deve validar corretamente uma senha válida', () => {
		const result = validation.validate('password', 'strongPass');
		expect(result).toBe('');
	});

	it('deve retornar um erro para uma senha muito curta', () => {
		const result = validation.validate('password', '123');
		expect(result).toBe('Password too short');
	});
});
