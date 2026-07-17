import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { GrupoSchema } from './grupo';
import { ParadaSchema, RecorridoSchema } from './recorrido';

export const TrackeoSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idGrupo: z.string().optional(),
  idRecorrido: z.string().optional(),
  idActivo: z.string().optional(),

  fecha: z.string().optional(),
  idParada: z.string().optional(),
  indiceParada: z.number().optional(),
  fechaProximaParada: z.string().optional(),
  idProximaParada: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  grupo: GrupoSchema.optional(),
  activo: ActivoSchema.optional(),
  recorrido: RecorridoSchema.optional(),
  parada: ParadaSchema.optional(),
  proximaParada: ParadaSchema.optional(),
});
export type ITrackeo = z.infer<typeof TrackeoSchema>;

export const CreateTrackeoSchema = TrackeoSchema.omit({
  _id: true,
  cliente: true,
  grupo: true,
  activo: true,
  recorrido: true,
  parada: true,
  proximaParada: true,
});
export type ICreateTrackeo = z.infer<typeof CreateTrackeoSchema>;

export const UpdateTrackeoSchema = TrackeoSchema.omit({
  _id: true,
  cliente: true,
  grupo: true,
  activo: true,
  recorrido: true,
  parada: true,
  proximaParada: true,
});
export type IUpdateTrackeo = z.infer<typeof UpdateTrackeoSchema>;
