import { describe, it, expect, vi } from 'vitest';
import { WorkshopFinalizeAppointment } from './index';
import { authorizedApi } from '@/lib';
import type { WorkshopAppointment } from './types';

vi.mock('@/lib');

const mockAuthorizedApi = authorizedApi as vi.Mocked<typeof authorizedApi>;

const mockAppointment: WorkshopAppointment = {
  customerData: {
    name: 'John Doe',
    documentNumber: '123456789',
    cellphone: '123456789',
    email: 'john.doe@example.com',
  },
  autoRepairShopData: {
    name: 'Auto Shop',
    email: 'shop@example.com',
    phone: '987654321',
    documentNumber: '987654321',
    addressData: {
      city: 'City',
      state: 'State',
      zipCode: '12345',
      address: '123 Main St',
    },
  },
  scheduleData: {
    date: '2023-10-10',
    timePeriod: 'morning',
  },
  vehicleData: 'Car Model',
  servicesData: {
    serviceType: 'Oil Change',
    additionalServices: ['Tire Rotation'],
  },
};

mockAuthorizedApi.post.mockImplementation(async () => ({ status: 200 }));

describe('WorkshopFinalizeAppointment', () => {
  it('deve retornar true quando a chamada à API for bem-sucedida', async () => {
    const result = await WorkshopFinalizeAppointment(mockAppointment);
    expect(result).toBe(true);
  });

  it('deve retornar false quando a variável de ambiente estiver ausente', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_CARBON_BASE_URL;
    delete process.env.NEXT_PUBLIC_CARBON_BASE_URL;

    const result = await WorkshopFinalizeAppointment(mockAppointment);
    expect(result).toBe(false);

    process.env.NEXT_PUBLIC_CARBON_BASE_URL = originalEnv;
  });

  it('deve retornar false quando a chamada à API falhar', async () => {
    mockAuthorizedApi.post.mockRejectedValueOnce(new Error('Erro de Rede'));

    const result = await WorkshopFinalizeAppointment(mockAppointment);
    expect(result).toBe(false);
  });
});
