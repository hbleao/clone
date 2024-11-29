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

export const useGeolocation = (): UseGeolocationResult => {
	const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(
		null,
	);
	const [error, setError] = useState<GeolocationError | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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

	const handleError = useCallback((error: GeolocationPositionError) => {
		setError({
			code: error.code,
			message: error.message,
		});

		setIsLoading(false);
	}, []);

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
