import { describe, it, expect, vi } from 'vitest';
import { ServiceProductByProductAlias } from './index';
import { authorizedApi } from '@/lib';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

mockAuthorizedApi.post.mockImplementation(async () => ({
  status: 200,
  data: {
    sourceSystemCode: 'system-123',
    alias: 'product-alias',
    name: 'Product Name',
    cardPrice: {
      oldPrice: 100,
      benefitsText: 'Benefits',
      discount: '10%',
      instalmentText: 'Instalment',
      label: { color: 'red', text: 'Label' },
      price: 90,
      title: 'Title',
    },
    categories: { category: 'Category', subCategory: 'SubCategory' },
    description: 'Product Description',
    image: { url: 'http://example.com/image.png', alt: 'Image' },
    isNew: true,
    isOffer: false,
    link: 'http://example.com/product',
    sku: 'SKU123',
    type: 'Type',
    maxServices: 5,
    partnerProductId: 'partner-123',
    specialtyCode: 'specialty-123',
    problem: 'Problem',
    comboId: 1,
    subject: 'Subject',
    originCode: 'origin-123',
    companyCode: 'company-123',
    items: [
      { category: 'Category', subCategory: 'SubCategory', label: 'Label', descricao: 'Description', id: 1 },
    ],
  },
}));

describe('ServiceProductByProductAlias', () => {
  it('deve retornar dados do produto quando a chamada à API for bem-sucedida', async () => {
    const result = await ServiceProductByProductAlias({ value: 'alias-test' });
    expect(result).toEqual({
      sourceSystemCode: 'system-123',
      alias: 'product-alias',
      name: 'Product Name',
      cardPrice: {
        oldPrice: 100,
        benefitsText: 'Benefits',
        discount: '10%',
        instalmentText: 'Instalment',
        label: { color: 'red', text: 'Label' },
        price: 90,
        title: 'Title',
      },
      categories: { category: 'Category', subCategory: 'SubCategory' },
      description: 'Product Description',
      image: { url: 'http://example.com/image.png', alt: 'Image' },
      isNew: true,
      isOffer: false,
      link: 'http://example.com/product',
      sku: 'SKU123',
      type: 'Type',
      maxServices: 5,
      partnerProductId: 'partner-123',
      specialtyCode: 'specialty-123',
      problem: 'Problem',
      comboId: 1,
      subject: 'Subject',
      originCode: 'origin-123',
      companyCode: 'company-123',
      items: [
        { category: 'Category', subCategory: 'SubCategory', label: 'Label', descricao: 'Description', id: 1 },
      ],
    });
  });

  it('deve retornar um objeto vazio quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_URL;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_URL;

    const result = await ServiceProductByProductAlias({ value: 'alias-test' });
    expect(result).toEqual({});

    process.env.NEXT_PUBLIC_CARBON_BASE_URL = originalEnv;
  });

  it('deve retornar um objeto vazio quando a chamada à API lançar uma exceção', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await ServiceProductByProductAlias({ value: 'alias-test' });
    expect(result).toEqual({});
  });
});
