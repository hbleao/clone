import { useCallback, useState } from 'react';

type GeolocationCoordinates = {
	latitude: number;
	longitude: number;
	accuracy: number;
	altitude?: number | null;
	altitudeAccuracy?: number | null;
	heading?: number | null;
	speed?: number | null;
};

type GeolocationError = {
	code: number;
	message: string;
};

type UseGeolocationResult = {
	coordinates: GeolocationCoordinates | null;
	error: GeolocationError | null;
	isLoading: boolean;
	requestGeolocation: () => void;
};

/**
 * Hook para obter informações de geolocalização do navegador.
 * @returns Um objeto contendo as coordenadas, possíveis erros, estado de carregamento e uma função para solicitar a geolocalização.
 */
export const useGeolocation = (): UseGeolocationResult => {
	const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null);
	const [error, setError] = useState<GeolocationError | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	/**
	 * Manipula o sucesso da solicitação de geolocalização.
	 * @param position As coordenadas retornadas pela API de geolocalização.
	 */
	const handleSuccess = useCallback((position: GeolocationPosition) => {
		const {
			latitude,
			longitude,
			accuracy,
			altitude,
			altitudeAccuracy,
			heading,
			speed,
		} = position.coords;

		setCoordinates({
			latitude,
			longitude,
			accuracy,
			altitude,
			altitudeAccuracy,
			heading,
			speed,
		});

		setIsLoading(false);
	}, []);

	/**
	 * Manipula erros durante a solicitação de geolocalização.
	 * @param error O erro retornado pela API de geolocalização.
	 */
	const handleError = useCallback((error: GeolocationPositionError) => {
		setError({
			code: error.code,
			message: error.message,
		});

		setIsLoading(false);
	}, []);

	/**
	 * Solicita a geolocalização do usuário.
	 * Verifica se o navegador suporta a API de geolocalização.
	 */
	const requestGeolocation = useCallback(() => {
		setIsLoading(true);

		if (!('geolocation' in navigator)) {
			setError({
				code: 0,
				message: 'Geolocation is not supported by your browser.',
			});
			setIsLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
	}, [handleSuccess, handleError]);

	return {
		coordinates,
		error,
		isLoading,
		requestGeolocation,
	};
};
