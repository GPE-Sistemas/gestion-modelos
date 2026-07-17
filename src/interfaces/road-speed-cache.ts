import { z } from 'zod';
import { GeoJSONPointSchema } from '../auxiliares';

// Versión reducida para enviar límites de velocidad entre gestion-api-gestion y gestion-api-eventos
export const SpeedLimitResultSchema = z.object({
  maxspeed: z.number().optional(), // km/h
  unidad: z.string().optional(),
  desconocido: z.boolean().optional(),
  confianza: z.enum(['explicito', 'inferido']).optional(),
  fuente: z.enum(['tomtom', 'osm', 'fallback']).optional(),
});
export type ISpeedLimitResult = z.infer<typeof SpeedLimitResultSchema>;

export const RoadSpeedCacheSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  geojson: GeoJSONPointSchema.optional(),
  geohash: z.string().optional(),
  maxspeed: z.number().optional(), // km/h ya normalizado
  unidad: z.string().optional(), // 'km/h' | 'mph' (unidad original de la fuente)
  desconocido: z.boolean().optional(), // true si no se pudo determinar ningún límite usable
  confianza: z.string().optional(), // 'explicito' | 'inferido' (informativo, no configurable)
  fuente: z.string().optional(), // 'tomtom' | 'osm' | 'fallback'
});
export type IRoadSpeedCache = z.infer<typeof RoadSpeedCacheSchema>;

export const CreateRoadSpeedCacheSchema = RoadSpeedCacheSchema.omit({
  _id: true,
});
export type ICreateRoadSpeedCache = z.infer<typeof CreateRoadSpeedCacheSchema>;

export const UpdateRoadSpeedCacheSchema = RoadSpeedCacheSchema.omit({
  _id: true,
});
export type IUpdateRoadSpeedCache = z.infer<typeof UpdateRoadSpeedCacheSchema>;
