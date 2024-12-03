import { describe, it, expect, beforeEach } from 'vitest';
import { encryptValue, encryptAES } from './encrypt';

describe('encrypt.ts', () => {
  describe('encryptValue', () => {
    it('should return undefined for undefined input', () => {
      expect(encryptValue(undefined)).toBeUndefined();
    });

    it('should return empty string for empty input', () => {
      expect(encryptValue('')).toBe('');
      expect(encryptValue('   ')).toBe('   ');
    });

    it('should encrypt non-empty string value', () => {
      const value = 'test123';
      const encrypted = encryptValue(value);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(value);
    });
  });

  describe('encryptAES', () => {
    it('should throw error for empty value', () => {
      expect(() => encryptAES('', 'key')).toThrow('Value and key must be non-empty strings');
    });

    it('should throw error for empty key', () => {
      expect(() => encryptAES('value', '')).toThrow('Value and key must be non-empty strings');
    });

    it('should encrypt string with given key', () => {
      const value = 'test123';
      const key = 'myKey';
      const encrypted = encryptAES(value, key);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(value);
    });

    it('should generate different encryptions for different keys', () => {
      const value = 'test123';
      const key1 = 'key1';
      const key2 = 'key2';
      const encrypted1 = encryptAES(value, key1);
      const encrypted2 = encryptAES(value, key2);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should generate same encryption for same value and key', () => {
      const value = 'test123';
      const key = 'myKey';
      const encrypted1 = encryptAES(value, key);
      const encrypted2 = encryptAES(value, key);
      expect(encrypted1).toBe(encrypted2);
    });
  });
});
