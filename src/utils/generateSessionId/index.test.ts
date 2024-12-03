import { describe, it, expect } from 'vitest';
import { generateSessionId } from './index';

describe('generateSessionId', () => {
  it('should generate a string', () => {
    const sessionId = generateSessionId();
    expect(typeof sessionId).toBe('string');
  });

  it('should generate unique IDs', () => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();
    expect(id1).not.toBe(id2);
  });

  it('should generate ID with correct format', () => {
    const sessionId = generateSessionId();
    // Verifica se é um UUID v4 válido
    expect(sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('should generate multiple unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 1000; i++) {
      ids.add(generateSessionId());
    }
    expect(ids.size).toBe(1000);
  });
});
