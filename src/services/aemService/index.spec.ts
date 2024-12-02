import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AEMService } from './AEMService';
import { HttpResponseHomeProps } from './types';

vi.mock('node-fetch', () => ({
    default: vi.fn(),
}));

import fetch from 'node-fetch';
const { Response } = fetch;

describe('AEMService', () => {
    const mockEndpoint = 'https://mock-api-endpoint.com';
    const mockRootItems = {
        ':items': {
            root: {
                ':items': {
                    experiencefragment: {
                        ':items': {
                            root: {
                                ':items': {
                                    header: { title: 'Mock Header' },
                                },
                            },
                        },
                    },
                    'experiencefragment-footer': {
                        ':items': {
                            root: {
                                ':items': {
                                    footer: { title: 'Mock Footer' },
                                },
                            },
                        },
                    },
                    responsivegrid: {
                        ':items': {
                            section1: { type: 'section', content: 'Section 1' },
                            section2: { type: 'section', content: 'Section 2' },
                            spacing1: { type: 'spacing', content: 'Spacing 1' },
                        },
                    },
                },
            },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return formatted content on success with all data', async () => {
        const mockResponse = {
            ...mockRootItems,
            ':type': 'porto/react-components/section-header',
        };

        (fetch as vi.Mock).mockResolvedValue(
            new Response(JSON.stringify(mockResponse), { status: 200 })
        );

        const result = await AEMService.getContent(mockEndpoint);

        expect(result).toBeDefined();
        expect(result.data).toEqual(mockResponse);
        expect(result.sections).toHaveLength(4); // Header, Section-Header, 2 Sections, Footer
        expect(result.sections[0].name).toBe('header');
        expect(result.sections[result.sections.length - 1].name).toBe('footer');
    });

    it('should exclude spacing components from sections', async () => {
        (fetch as vi.Mock).mockResolvedValue(
            new Response(JSON.stringify(mockRootItems), { status: 200 })
        );

        const result = await AEMService.getContent(mockEndpoint);

        const sectionNames = result.sections.map((section) => section.name);
        expect(sectionNames).not.toContain('spacing');
    });

    it('should handle missing sections gracefully', async () => {
        const mockResponse = { ...mockRootItems };
        delete mockResponse[':items'].root[':items'].responsivegrid;

        (fetch as vi.Mock).mockResolvedValue(
            new Response(JSON.stringify(mockResponse), { status: 200 })
        );

        const result = await AEMService.getContent(mockEndpoint);

        expect(result.sections).toHaveLength(2); // Only Header and Footer
    });

    it('should handle an empty response gracefully', async () => {
        (fetch as vi.Mock).mockResolvedValue(new Response('{}', { status: 200 }));

        const result = await AEMService.getContent(mockEndpoint);

        expect(result.sections).toEqual([]);
        expect(result.data).toEqual({});
    });

    it('should handle invalid JSON response gracefully', async () => {
        (fetch as vi.Mock).mockResolvedValue(new Response('Invalid JSON', { status: 200 }));

        await expect(AEMService.getContent(mockEndpoint)).rejects.toThrowError();
    });

    it('should return an empty sections array if fetch fails', async () => {
        (fetch as vi.Mock).mockRejectedValue(new Error('Network error'));

        const result = await AEMService.getContent(mockEndpoint);

        expect(result.sections).toEqual([]);
        expect(result.data).toEqual({});
    });

    it('should throw an error if the fetch response is not ok', async () => {
        (fetch as vi.Mock).mockResolvedValue(new Response('Not Found', { status: 404 }));

        const result = await AEMService.getContent(mockEndpoint);

        expect(result.sections).toEqual([]);
        expect(result.data).toEqual({});
    });
});
