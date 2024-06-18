export interface ICoordenadas {
  lat: number;
  lng: number;
}

/**
 * Coordenadas en formato OpenLayers (Coordinate).
 *
 * Puede estar codificada.
 *
 * An array of numbers representing an xy, xyz or xyzm coordinate.
 * @example [-58.3816, -34.6037]
 */
export type ICoordenadaOL = number[];
