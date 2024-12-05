import { describe, it, expect, vi } from 'vitest';
import { ServiceProductByCategory } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

mockAuthorizedApi.post.mockImplementation(async () => ({
  status: 200,
  data: [
    {
      alias: 'product-alias',
      cardPrice: {
        discount: '10%',
        instalmentText: '10x de R$10,00',
        label: { color: 'red', text: 'Promoção' },
        price: 'R$100,00',
        title: 'Oferta',
      },
      categories: { category: 'Eletrônicos', subCategory: 'Celulares' },
      description: 'Smartphone de última geração',
      id: 1,
      image: { alt: 'Smartphone', src: 'http://example.com/smartphone.png' },
      isNew: true,
      isOffer: true,
      link: { text: 'Ver mais', href: 'http://example.com/product' },
      name: 'Smartphone XYZ',
      sku: 'SKU123',
      type: 'Eletrônico',
    },
  ],
}));

describe('ServiceProductByCategory', () => {
  it('deve retornar produtos quando a chamada à API for bem-sucedida', async () => {
    const result = await ServiceProductByCategory({ value: 'eletronicos' });
    expect(result).toEqual({
      data: [
        {
          alias: 'product-alias',
          cardPrice: {
            discount: '10%',
            instalmentText: '10x de R$10,00',
            label: { color: 'red', text: 'Promoção' },
            price: 'R$100,00',
            title: 'Oferta',
          },
          categories: { category: 'Eletrônicos', subCategory: 'Celulares' },
          description: 'Smartphone de última geração',
          id: 1,
          image: { alt: 'Smartphone', src: 'http://example.com/smartphone.png' },
          isNew: true,
          isOffer: true,
          link: { text: 'Ver mais', href: 'http://example.com/product' },
          name: 'Smartphone XYZ',
          sku: 'SKU123',
          type: 'Eletrônico',
        },
      ],
      status: 200,
    });
  });

  it('deve retornar um array vazio quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_URL;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_URL;

    const result = await ServiceProductByCategory({ value: 'eletronicos' });
    expect(result).toEqual({ data: [], status: 500 });

    process.env.NEXT_PUBLIC_CARBON_BASE_URL = originalEnv;
  });

  it('deve retornar um array vazio quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await ServiceProductByCategory({ value: 'eletronicos' });
    expect(result).toEqual({ data: [], status: 500 });
  });
});
