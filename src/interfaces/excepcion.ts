import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const ExcepcionSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  tipoEntidad: z.enum(['Cliente', 'Alarma']).optional(),
  idEntidad: z.string().optional(),
  tipoExcepcion: z.enum(['Control Horario']).optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IExcepcion = z.infer<typeof ExcepcionSchema>;

export const CreateExcepcionSchema = ExcepcionSchema.omit({
  _id: true,
  idsAncestros: true,
  //Virtuals
  cliente: true,
  ancestros: true,
});
export type ICreateExcepcion = z.infer<typeof CreateExcepcionSchema>;

export const UpdateExcepcionSchema = ExcepcionSchema.omit({
  _id: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
});
export type IUpdateExcepcion = z.infer<typeof UpdateExcepcionSchema>;

export const ExcepcionCacheSchema = ExcepcionSchema.omit({
  cliente: true,
  ancestros: true,
});
export type IExcepcionCache = z.infer<typeof ExcepcionCacheSchema>;
