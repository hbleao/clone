'use server';

import { env } from 'next-runtime-env';
import type { AddressData } from './type';

function getDefaultAddressData(): AddressData {
  return {
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    address: '',
    lat: '',
    lng: '',
  };
}

export async function CepGoogleMapsService(cep: string): Promise<AddressData> {
  try {
    const response = await fetch(`${env('NEXT_PUBLIC_API_NEXT_BASE_URL')}/api/caps/cep/${cep}`);

    if (!response.ok) {
      console.error(`Error fetching data for CEP ${cep}: ${response.status} ${response.statusText}`);
      return getDefaultAddressData();
    }

    const data: AddressData = await response.json();
    return data;
  } catch (error) {
    console.error('Network error in CepGoogleMapsService:', error);
    return getDefaultAddressData();
  }
}
