/*
Spherical Law of Cosines
https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
*/

const toRadians = (degree: number) => (degree * Math.PI) / 180;

export const calculateDistance = (
	originLatitude: number,
	originLongitude: number,
	destinationLatitude: number,
	destinationLongitude: number,
) => {
	const earthRadiusKm = 6371;
	const deltaLatitude = toRadians(destinationLatitude - originLatitude);
	const deltaLongitude = toRadians(destinationLongitude - originLongitude);

	const haversineFormulaComponent =
		Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
		Math.cos(toRadians(originLatitude)) *
			Math.cos(toRadians(destinationLatitude)) *
			Math.sin(deltaLongitude / 2) *
			Math.sin(deltaLongitude / 2);

	const angularDistance =
		2 *
		Math.atan2(
			Math.sqrt(haversineFormulaComponent),
			Math.sqrt(1 - haversineFormulaComponent),
		);

	return earthRadiusKm * angularDistance;
};
