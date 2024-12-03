import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupDataLayer, pushToDataLayer, clearDataLayer } from './setupDataLayer';

describe('setupDataLayer.ts', () => {
  beforeEach(() => {
    // Mock window object
    vi.stubGlobal('window', {
      dataLayer: undefined
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('setupDataLayer', () => {
    it('should initialize dataLayer if undefined', () => {
      setupDataLayer();
      expect(window.dataLayer).toEqual([]);
    });

    it('should preserve existing dataLayer', () => {
      const existingDataLayer = [{ event: 'test' }];
      vi.stubGlobal('window', { dataLayer: existingDataLayer });
      setupDataLayer();
      expect(window.dataLayer).toBe(existingDataLayer);
    });

    it('should handle undefined window object', () => {
      vi.stubGlobal('window', undefined);
      expect(() => setupDataLayer()).not.toThrow();
    });
  });

  describe('pushToDataLayer', () => {
    it('should push event to dataLayer', () => {
      const event = { event: 'test_event', data: 'test_data' };
      pushToDataLayer(event);
      expect(window.dataLayer).toEqual([event]);
    });

    it('should initialize dataLayer before pushing', () => {
      const event = { event: 'test_event' };
      pushToDataLayer(event);
      expect(window.dataLayer).toEqual([event]);
    });

    it('should handle multiple pushes', () => {
      const event1 = { event: 'event1' };
      const event2 = { event: 'event2' };
      pushToDataLayer(event1);
      pushToDataLayer(event2);
      expect(window.dataLayer).toEqual([event1, event2]);
    });

    it('should handle undefined window object', () => {
      vi.stubGlobal('window', undefined);
      expect(() => pushToDataLayer({ event: 'test' })).not.toThrow();
    });

    it('should handle push error', () => {
      vi.stubGlobal('window', {
        dataLayer: {
          push: vi.fn().mockImplementation(() => {
            throw new Error('Test error');
          })
        }
      });
      const consoleSpy = vi.spyOn(console, 'error');
      pushToDataLayer({ event: 'test' });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('clearDataLayer', () => {
    it('should clear dataLayer', () => {
      window.dataLayer = [{ event: 'test' }];
      clearDataLayer();
      expect(window.dataLayer).toEqual([]);
    });

    it('should handle undefined window object', () => {
      vi.stubGlobal('window', undefined);
      expect(() => clearDataLayer()).not.toThrow();
    });

    it('should handle clear error', () => {
      vi.stubGlobal('window', {
        get dataLayer() {
          throw new Error('Test error');
        },
        set dataLayer(value) {
          throw new Error('Test error');
        }
      });
      const consoleSpy = vi.spyOn(console, 'error');
      clearDataLayer();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
