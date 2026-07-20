import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';

export const LogTrackeoSchema = z.object({
  _id: z.string().optional(),
  expireAt: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idActivo: z.string().optional(),
  fecha: z.string().optional(),
  nuevaParada: z.boolean().optional(),
  indexUltimaParada: z.number().optional(),
  indexParadaActual: z.number().optional(),
  ultimaParada: z.string().optional(),
  paradaActual: z.string().optional(),
  totalParadas: z.number().optional(),
  motivo: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  activo: ActivoSchema.optional(),
});
export type ILogTrackeo = z.infer<typeof LogTrackeoSchema>;

export const CreateLogTrackeoSchema = LogTrackeoSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
});
export type ICreateLogTrackeo = z.infer<typeof CreateLogTrackeoSchema>;

export const UpdateLogTrackeoSchema = LogTrackeoSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
});
export type IUpdateLogTrackeo = z.infer<typeof UpdateLogTrackeoSchema>;
