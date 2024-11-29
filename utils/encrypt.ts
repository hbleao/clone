

import cryptoJS from 'crypto-js';

/**
 * Criptografa um valor usando AES com uma chave predefinida.
 * @param value O valor a ser criptografado.
 * @returns O valor criptografado ou `undefined` caso o valor original seja inválido.
 */
export function encryptValue(value: string | undefined): string | undefined {
	// Validar entrada
	if (!value) {
		console.warn('No value provided for encryption.');
		return undefined;
	}

	const encryptionKey = 'chave';
	return encryptAES(value, encryptionKey);
}

/**
 * Criptografa uma string usando o algoritmo AES.
 * @param value O valor a ser criptografado.
 * @param key A chave de criptografia.
 * @returns O valor criptografado como string.
 */
export function encryptAES(value: string, key: string): string {
	if (!value || !key) {
		throw new Error('Both value and key are required for encryption.');
	}

	return cryptoJS.AES.encrypt(value, key).toString();
}
