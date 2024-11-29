import cryptoJS from 'crypto-js';

export const encryptValue = (value: string | undefined) => {
	if (!value) return value;
	return encryptAES(value, 'chave');
};
export const encryptAES = (value: string, key: string) => {
	return cryptoJS.AES.encrypt(value, key).toString();
};
