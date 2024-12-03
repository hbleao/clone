/*
Spherical Law of Cosines
https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
*/

/**
 * Constante que representa o raio da Terra em quilômetros
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Converte graus para radianos
 * @param {number} degree - Valor em graus a ser convertido
 * @returns {number} Valor convertido em radianos
 */
const toRadians = (degree: number): number => (degree * Math.PI) / 180;

/**
 * Interface para coordenadas geográficas
 */
interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

/**
 * Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine
 * (Spherical Law of Cosines)
 * 
 * @see {@link https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898|Referência}
 * 
 * @param {number} originLatitude - Latitude do ponto de origem em graus decimais
 * @param {number} originLongitude - Longitude do ponto de origem em graus decimais
 * @param {number} destinationLatitude - Latitude do ponto de destino em graus decimais
 * @param {number} destinationLongitude - Longitude do ponto de destino em graus decimais
 * @returns {number} Distância em quilômetros entre os dois pontos
 * 
 * @example
 * // Calcular distância entre São Paulo e Rio de Janeiro
 * const distance = calculateDistance(
 *   -23.5505, // São Paulo latitude
 *   -46.6333, // São Paulo longitude
 *   -22.9068, // Rio de Janeiro latitude
 *   -43.1729  // Rio de Janeiro longitude
 * );
 */
export const calculateDistance = (
  originLatitude: number,
  originLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
): number => {
  // Calcula as diferenças em radianos
  const deltaLatitude = toRadians(destinationLatitude - originLatitude);
  const deltaLongitude = toRadians(destinationLongitude - originLongitude);

  // Calcula o componente da fórmula de Haversine
  const haversineFormulaComponent =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(toRadians(originLatitude)) *
    Math.cos(toRadians(destinationLatitude)) *
    Math.sin(deltaLongitude / 2) *
    Math.sin(deltaLongitude / 2);

  // Calcula a distância angular
  const angularDistance =
    2 * Math.atan2(
      Math.sqrt(haversineFormulaComponent),
      Math.sqrt(1 - haversineFormulaComponent)
    );

  // Retorna a distância em quilômetros
  return EARTH_RADIUS_KM * angularDistance;
};

/**
 * Versão alternativa que aceita objetos de coordenadas
 * 
 * @param {GeoCoordinate} origin - Coordenadas do ponto de origem
 * @param {GeoCoordinate} destination - Coordenadas do ponto de destino
 * @returns {number} Distância em quilômetros entre os dois pontos
 * 
 * @example
 * const distance = calculateDistanceFromCoords(
 *   { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
 *   { latitude: -22.9068, longitude: -43.1729 }  // Rio de Janeiro
 * );
 */
export const calculateDistanceFromCoords = (
  origin: GeoCoordinate,
  destination: GeoCoordinate
): number => {
  return calculateDistance(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );
};
