import { describe, it, expect, vi } from 'vitest';
import { AEMService } from './index';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockResponse = (data: any, ok = true) => {
  return {
    ok,
    json: async () => data,
  };
};

describe('AEMService', () => {
  it('should return formatted sections when API call is successful', async () => {
    const mockData = {
      ':items': {
        root: {
          ':items': {
            experiencefragment: {
              ':items': {
                root: {
                  ':items': {
                    header: 'Header Content',
                  },
                },
              },
            },
            'experiencefragment-footer': {
              ':items': {
                root: {
                  ':items': {
                    footer: 'Footer Content',
                  },
                },
              },
            },
            responsivegrid: {
              ':items': {
                section1: { content: 'Section 1 Content' },
                section2: { content: 'Section 2 Content' },
              },
            },
          },
        },
      },
    };

    mockFetch.mockResolvedValueOnce(mockResponse(mockData));

    const result = await AEMService.getContent('http://mock-endpoint');

    expect(result.sections).toEqual([
      { name: 'header', component: 'Header Content' },
      { name: 'section1', component: { content: 'Section 1 Content' } },
      { name: 'section2', component: { content: 'Section 2 Content' } },
      { name: 'footer', component: 'Footer Content' },
    ]);
  });

  it('should return empty sections array when API call fails', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}, false));

    const result = await AEMService.getContent('http://mock-endpoint');

    expect(result.sections).toEqual([]);
  });

  it('should log error when API call throws an exception', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await AEMService.getContent('http://mock-endpoint');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in AEMService.getContent:', expect.any(Error));
    expect(result.sections).toEqual([]);

    consoleErrorSpy.mockRestore();
  });
});
