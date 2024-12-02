import { describe, it, expect, vi } from 'vitest';
import { encryptValue, encryptAES } from './encryption';
import cryptoJS from 'crypto-js';

vi.mock('crypto-js', () => ({
	AES: {
		encrypt: vi.fn(),
	},
}));

describe('encryptValue', () => {
	it('should return undefined if value is not provided', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = encryptValue(undefined);

		expect(result).toBeUndefined();
		expect(consoleWarnSpy).toHaveBeenCalledWith('No value provided for encryption.');

		consoleWarnSpy.mockRestore();
	});

	it('should encrypt a value with a predefined key', () => {
		const mockEncryptedValue = 'mock-encrypted-value';
		(cryptoJS.AES.encrypt as vi.Mock).mockReturnValue({ toString: () => mockEncryptedValue });

		const result = encryptValue('test-value');

		expect(result).toBe(mockEncryptedValue);
		expect(cryptoJS.AES.encrypt).toHaveBeenCalledWith('test-value', 'chave');
	});
});

describe('encryptAES', () => {
	it('should throw an error if value is not provided', () => {
		expect(() => encryptAES('', 'test-key')).toThrow(
			'Both value and key are required for encryption.',
		);
	});

	it('should throw an error if key is not provided', () => {
		expect(() => encryptAES('test-value', '')).toThrow(
			'Both value and key are required for encryption.',
		);
	});

	it('should encrypt a value using AES and return as string', () => {
		const mockEncryptedValue = 'mock-encrypted-value';
		(cryptoJS.AES.encrypt as vi.Mock).mockReturnValue({ toString: () => mockEncryptedValue });

		const result = encryptAES('test-value', 'test-key');

		expect(result).toBe(mockEncryptedValue);
		expect(cryptoJS.AES.encrypt).toHaveBeenCalledWith('test-value', 'test-key');
	});
});
