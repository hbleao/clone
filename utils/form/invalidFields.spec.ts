import { describe, it, expect } from 'vitest';
import { validateFields } from './validateFields';

describe('validateFields', () => {
	it('should return false when all fields are valid (empty strings)', () => {
		const fields = {
			name: '',
			email: '',
			password: '',
		};

		const result = validateFields(fields);

		expect(result).toBe(false);
	});

	it('should return the object of invalid fields when there are errors', () => {
		const fields = {
			name: '',
			email: 'Invalid email format',
			password: '',
		};

		const result = validateFields(fields);

		expect(result).toEqual(fields);
	});

	it('should handle an empty object and return false', () => {
		const fields = {};

		const result = validateFields(fields);

		expect(result).toBe(false);
	});

	it('should handle all fields with errors', () => {
		const fields = {
			name: 'Name is required',
			email: 'Email is invalid',
			password: 'Password is too short',
		};

		const result = validateFields(fields);

		expect(result).toEqual(fields);
	});
});
