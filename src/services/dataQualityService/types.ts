export type DataQualityServiceProps = {
	type: 'email' | 'telefone' | 'nome-social';
	param: string;
};

export type DataQualityServiceResponse = {
	isValid: boolean;
	message?: string;
};
