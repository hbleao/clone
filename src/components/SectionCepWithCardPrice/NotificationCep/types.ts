import type { IAddress } from '@/dtos';

export type NotificationCepProps = {
	error: boolean;
	address: IAddress;
	cep: string;
	coverage: boolean;
};
