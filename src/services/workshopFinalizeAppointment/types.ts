export interface CustomerData {
	name: string;
	socialName?: string;
	documentNumber: string;
	cellphone: string;
	email: string;
}

export interface AddressData {
	city: string;
	state: string;
	zipCode: string;
	address: string;
}

export interface AutoRepairShopData {
	name: string;
	email: string;
	phone: string;
	documentNumber: string;
	addressData: AddressData;
}

export interface ScheduleData {
	date: string;
	timePeriod: string;
}

export interface ServicesData {
	serviceType: string;
	additionalServices: string[];
}

export interface WorkshopAppointment {
	customerData: CustomerData;
	autoRepairShopData: AutoRepairShopData;
	scheduleData: ScheduleData;
	vehicleData: string;
	servicesData: ServicesData;
}
