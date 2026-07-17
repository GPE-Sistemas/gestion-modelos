import { z } from "zod";

export const CoordenadasSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
export type ICoordenadas = z.infer<typeof CoordenadasSchema>;

/**
 * Coordenadas en formato OpenLayers (Coordinate).
 *
 * Puede estar codificada.
 *
 * An array of numbers representing an xy, xyz or xyzm coordinate.
 * @example [-58.3816, -34.6037]
 */
export const CoordenadaOLSchema = z.array(z.number());
export type ICoordenadaOL = z.infer<typeof CoordenadaOLSchema>;
