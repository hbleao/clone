import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CapsServicesService } from './CapsServicesService';
import { api } from '@/lib';
import { formatAemImageUrl } from '@/utils';
import type { IProduct } from '@/dtos';

vi.mock('@/lib', () => ({
    api: {
        get: vi.fn(),
    },
}));

vi.mock('@/utils', () => ({
    formatAemImageUrl: vi.fn(),
}));

describe('CapsServicesService', () => {
    const mockEndpoint = 'https://mock-api-endpoint.com/api/caps/servicos';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return formatted products when API response is successful', async () => {
        const mockProducts: IProduct[] = [
            {
                id: 1,
                name: 'Product 1',
                description: 'Description 1',
                image: { src: 'image1.jpg', alt: 'Image 1' },
            },
            {
                id: 2,
                name: 'Product 2',
                description: 'Description 2',
                image: { src: 'image2.jpg', alt: 'Image 2' },
            },
        ];

        (api.get as vi.Mock).mockResolvedValue({
            status: 200,
            data: mockProducts,
        });

        (formatAemImageUrl as vi.Mock).mockImplementation((url) => `formatted-${url}`);

        const result = await CapsServicesService();

        expect(result).toEqual([
            {
                id: 1,
                name: 'Product 1',
                description: 'Description 1',
                image: { src: 'formatted-image1.jpg', alt: 'Image 1' },
            },
           
