import { z } from 'zod';
import { GeoJSONPointSchema } from '../auxiliares';

export const PartesDireccionSchema = z.object({
  calle: z.string().optional(),
  numero: z.string().optional(),
  barrio: z.string().optional(),
  ciudad: z.string().optional(),
  partido: z.string().optional(),
  provincia: z.string().optional(),
  pais: z.string().optional(),
  codigoPostal: z.string().optional(),
});
export type IPartesDireccion = z.infer<typeof PartesDireccionSchema>;

export const GeoCacheSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  geojson: GeoJSONPointSchema.optional(),
  geohash: z.string().optional(),
  direccion: z.string().optional(),
  partes: PartesDireccionSchema.optional(),
  fuente: z.string().optional(), // Fuente de los datos (ej. Google Maps, OpenStreetMap, etc.)
});
export type IGeoCache = z.infer<typeof GeoCacheSchema>;

export const CreateGeoCacheSchema = GeoCacheSchema.omit({ _id: true });
export type ICreateGeoCache = z.infer<typeof CreateGeoCacheSchema>;

export const UpdateGeoCacheSchema = GeoCacheSchema.omit({ _id: true });
export type IUpdateGeoCache = z.infer<typeof UpdateGeoCacheSchema>;
