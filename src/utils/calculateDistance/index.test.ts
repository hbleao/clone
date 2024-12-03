import { describe, it, expect } from 'vitest';
import { calculateDistance } from './index';

describe('calculateDistance', () => {
  it('should calculate distance between two points correctly', () => {
    const point1 = { lat: -23.550520, lng: -46.633308 }; // São Paulo
    const point2 = { lat: -22.906847, lng: -43.172897 }; // Rio de Janeiro
    
    const distance = calculateDistance(point1, point2);
    
    // A distância aproximada entre SP e RJ é ~360km
    expect(distance).toBeGreaterThan(350);
    expect(distance).toBeLessThan(370);
  });

  it('should return 0 for same coordinates', () => {
    const point = { lat: -23.550520, lng: -46.633308 };
    const distance = calculateDistance(point, point);
    expect(distance).toBe(0);
  });

  it('should handle negative coordinates', () => {
    const point1 = { lat: -23.550520, lng: -46.633308 };
    const point2 = { lat: -22.906847, lng: -43.172897 };
    
    const distance = calculateDistance(point1, point2);
    expect(distance).toBeGreaterThan(0);
  });
});
