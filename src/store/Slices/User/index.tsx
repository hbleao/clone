import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Workshop } from '@/templates/workshopFlow/Address/reducer/types';
import type {
	Address,
	Appointment,
	PersonalData,
	Product,
	UserProps,
} from './types';

const initialUserData = {
	product: {
		id: 0,
		alias: '',
		name: '',
		cardPrice: {
			oldPrice: 0,
			benefitsText: '',
			discount: '',
			instalmentText: '',
			label: {
				color: '',
				text: '',
			},
			price: 0,
			title: '',
		},
		categories: {
			category: '',
			subCategory: '',
		},
		description: '',
		image: {
			src: '',
			alt: '',
		},
		isNew: false,
		isOffer: false,
		link: '',
		sku: '',
		type: '',
		coupon: '',
		maxServices: 0,
		partnerProductId: '',
		comboId: 0,
		specialtyCode: '',
		problem: '',
		originCode: '',
		companyCode: '',
		items: [],
		selectedItems: [],
		serviceTypeId: 0,
		sourceSystemCode: '',
		subject: '',
		isLoadingProduct: false,
		isValidCoupon: false,
	},
	personalData: {
		cpf: '',
		email: '',
		fullName: '',
		phone: '',
		socialName: '',
		acceptTerms: false,
		mktCommunication: false,
	},
	address: {
		cep: '',
		street: '',
		number: '',
		neighborhood: '',
		city: '',
		state: '',
		stateCode: '',
	},
	appointment: {
		availableDays: [],
		day: '',
		time: '',
		month: '',
		schedules: [],
		serviceDateTime: '',
	},
	vehicle: '',
	workshopSelected: {
		code: '',
		name: '',
		address: '',
		district: '',
		city: '',
		state: '',
		zipCode: '',
		macroRegions: '',
		areaCode: '',
		phone: '',
		companyName: '',
		taxId: '',
		workingSaturday: true,
		latitude: '',
		longitude: '',
		distance: '',
		email: '',
	},
};

export const useUserStore = create(
	persist<UserProps>(
		(set, get) => ({
			user: initialUserData,
			setPersonalDataUser: (newData: PersonalData) =>
				set({
					user: {
						...get().user,
						personalData: { ...get().user.personalData, ...newData },
					},
				}),
			setAddressUser: (newAddressInfo: Address) =>
				set({
					user: {
						...get().user,
						address: { ...get().user.address, ...newAddressInfo },
					},
				}),
			setProductUser: (productInfo: Product) =>
				set({
					user: {
						...get().user,
						product: { ...get().user.product, ...productInfo },
					},
				}),
			setAppointmentUser: (newAppointment: Appointment) =>
				set({
					user: {
						...get().user,
						appointment: { ...get().user.appointment, ...newAppointment },
					},
				}),
			setWorkshopSelected: (newWorkshop: Workshop) =>
				set({
					user: {
						...get().user,
						workshopSelected: newWorkshop,
					},
				}),
			setVehicle: (newVehicle: string) =>
				set({
					user: {
						...get().user,
						vehicle: newVehicle,
					},
				}),
			cleanUserData: () =>
				set({
					user: initialUserData,
				}),
		}),
		{
			name: '@portoservicos-user',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
