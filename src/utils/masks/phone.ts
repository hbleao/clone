export const phoneMask = (value: string): string => {
	const cleanPhoneNumber = value.replace(/\D/g, '').slice(0, 11);

	if (value.length <= 10) {
		return cleanPhoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
	}

	return cleanPhoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};
