import { describe, it, expect, vi } from 'vitest';
import { generateSessionId } from './generateSessionId';

describe('generateSessionId', () => {
	it('should generate a valid session ID for a given orgId', () => {
		const orgId = 'myOrg';
		const result = generateSessionId(orgId);

		expect(result).toMatch(new RegExp(`^\\d{17}-\\d+-${orgId.toUpperCase()}$`));
	});

	it('should include the organization ID in uppercase in the session ID', () => {
		const orgId = 'myOrg';
		const result = generateSessionId(orgId);

		expect(result.endsWith(`-${orgId.toUpperCase()}`)).toBe(true);
	});

	it('should throw an error if orgId is not provided', () => {
		expect(() => generateSessionId('')).toThrow(
			'Organization ID is required to generate a session ID.',
		);
	});

	it('should generate a different session ID for subsequent calls', () => {
		const orgId = 'myOrg';
		const result1 = generateSessionId(orgId);
		const result2 = generateSessionId(orgId);

		expect(result1).not.toBe(result2);
	});

	it('should include the current date and time in the session ID', () => {
		const orgId = 'myOrg';
		const now = new Date();
		const expectedDatePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
			2,
			'0',
		)}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(
			2,
			'0',
		)}${String(now.getMinutes()).padStart(2, '0')}`;

		const result = generateSessionId(orgId);

		expect(result.startsWith(expectedDatePart)).toBe(true);
	});
});
