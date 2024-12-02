interface AddressComponent {
	long_name: string;
	types: string[];
}

interface AddressData {
	cep: string;
	street: string | null;
	neighborhood: string | null;
	city: string | null;
	state: string | null;
	address: string;
	lat: number;
	lng: number;
}

interface TFormatAddress {
	result: {
		formatted_address: string;
		address_components: AddressComponent[];
		geometry: {
			location: {
				lat: number;
				lng: number;
			};
		};
	};
	cep: string;
}

export function formatAddress({ result, cep }: TFormatAddress): AddressData {
	const getAddressComponent = (type: string) =>
		result.address_components.find((comp) => comp.types.includes(type))
			?.long_name || null;

	return {
		cep,
		street: getAddressComponent('route'),
		neighborhood:
			getAddressComponent('sublocality') || getAddressComponent('political'),
		city: getAddressComponent('administrative_area_level_2'),
		state: getAddressComponent('administrative_area_level_1'),
		address: result.formatted_address,
		lat: result.geometry.location.lat,
		lng: result.geometry.location.lng,
	};
}
