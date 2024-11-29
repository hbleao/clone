/**
 * Converte graus em radianos.
 * @param degree O valor em graus.
 * @returns O valor convertido para radianos.
 */
const toRadians = (degree: number): number => (degree * Math.PI) / 180;

/**
 * Calcula a distância entre dois pontos geográficos utilizando a fórmula do Haversine.
 * @param originLatitude Latitude do ponto de origem.
 * @param originLongitude Longitude do ponto de origem.
 * @param destinationLatitude Latitude do ponto de destino.
 * @param destinationLongitude Longitude do ponto de destino.
 * @returns A distância em quilômetros entre os dois pontos.
 */

export const calculateDistance = (
	originLatitude: number,
	originLongitude: number,
	destinationLatitude: number,
	destinationLongitude: number,
): number => {
	const EARTH_RADIUS_KM = 6371;

	// Diferenças em radianos
	const deltaLatitude = toRadians(destinationLatitude - originLatitude);
	const deltaLongitude = toRadians(destinationLongitude - originLongitude);

	// Componentes da fórmula de Haversine
	const haversineComponent =
		Math.sin(deltaLatitude / 2) ** 2 +
		Math.cos(toRadians(originLatitude)) *
			Math.cos(toRadians(destinationLatitude)) *
			Math.sin(deltaLongitude / 2) ** 2;

	// Distância angular em radianos
	const angularDistance = 2 * Math.atan2(Math.sqrt(haversineComponent), Math.sqrt(1 - haversineComponent));

	// Distância final em quilômetros
	return EARTH_RADIUS_KM * angularDistance;
};
