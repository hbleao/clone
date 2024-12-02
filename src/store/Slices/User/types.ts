import type { IScheduling } from '@/dtos';
import type { Workshop } from '@/templates/workshopFlow/Address/reducer/types';

export type PersonalData = {
	cpf?: string;
	fullName?: string;
	socialName?: string;
	phone?: string;
	email?: string;
	hasSocialName?: boolean;
	acceptTerms?: boolean;
	mktCommunication?: boolean;
};

export type Address = {
	cep?: string;
	street?: string;
	number?: string;
	neighborhood?: string;
	city?: string;
	state?: string;
	stateCode?: string;
	complement?: string;
	latitude?: number;
	longitude?: number;
};

export type Item = {
	category: string;
	label: string;
	price?: string;
	subCategory: string;
	id?: number;
	sku?: string;
	partnerProductId?: string;
};

export type Product = {
	id?: number;
	alias?: string;
	name?: string;
	cardPrice?: CardPrice;
	categories?: Categories;
	description?: string;
	coupon?: string;
	image?: Image;
	isNew?: boolean;
	isOffer?: boolean;
	link?: string;
	partnerProductId?: string;
	specialtyCode?: string;
	problem?: string;
	originCode?: string;
	companyCode?: string;
	sku?: string;
	type?: string;
	maxServices?: number;
	comboId?: number;
	items?: Item[];
	selectedItems?: any[];
	serviceTypeId?: number;
	sourceSystemCode?: string;
	subject?: string;
	isLoadingProduct?: boolean;
	isErrorProduct?: boolean;
	isValidCoupon?: boolean;
};

type CardPrice = {
	discount?: string;
	oldPrice?: number;
	benefitsText?: string;
	instalmentText?: string;
	label?: {
		color: string;
		text: string;
	};
	price?: number;
	title?: string;
};

type Categories = {
	category: string;
	subCategory: string;
};

type Image = {
	alt: string;
	src: string;
};

export type Appointment = {
	availableDays?: IScheduling[];
	day?: string;
	time?: string;
	month?: string;
	schedules?: {
		time: string;
		serviceDateTime: string;
	}[];
	serviceDateTime?: string;
};

export type User = {
	personalData: PersonalData;
	address: Address;
	product: Product;
	appointment: Appointment;
	vehicle: string;
	workshopSelected: Workshop;
};

export type UserProps = {
	user: User;
	setPersonalDataUser: (personalData: PersonalData) => void;
	setAddressUser: (address: Address) => void;
	setProductUser: (product: Product) => void;
	setAppointmentUser: (appointment: Appointment) => void;
	setWorkshopSelected: (workshop: Workshop) => void;
	setVehicle: (vehicle: string) => void;
	cleanUserData: () => void;
};
