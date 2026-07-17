import { z } from 'zod';

export const RolEnVisitaSchema = z.enum([
  'arribo',
  'partida',
  'contiene',
  'durante',
]);
export type RolEnVisita = z.infer<typeof RolEnVisitaSchema>;

export const VisitaTripSchema = z.object({
  tripId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  distance: z.number().optional(),
  duration: z.number().optional(),
  maxSpeed: z.number().optional(),
  avgSpeed: z.number().optional(),
  startLat: z.number().optional(),
  startLon: z.number().optional(),
  endLat: z.number().optional(),
  endLon: z.number().optional(),
  rolEnVisita: RolEnVisitaSchema.optional(),
});
export type IVisitaTrip = z.infer<typeof VisitaTripSchema>;

export const VisitaUbicacionSchema = z.object({
  entrada: z.string().optional(),
  salida: z.string().optional(),
  permanenciaSegundos: z.number().optional(),
  cantidadReportes: z.number().optional(),
  yaEstabaAlInicio: z.boolean().optional(),
  seguiaAlFinal: z.boolean().optional(),
  entradaCoords: z.tuple([z.number(), z.number()]).optional(),
  salidaCoords: z.tuple([z.number(), z.number()]).optional(),
  trips: z.array(VisitaTripSchema).optional(),
});
export type IVisitaUbicacion = z.infer<typeof VisitaUbicacionSchema>;

export const QueryVisitasUbicacionSchema = z.object({
  idVehiculo: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  gapMin: z.number().optional(),
});
export type IQueryVisitasUbicacion = z.infer<
  typeof QueryVisitasUbicacionSchema
>;
