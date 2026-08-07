import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const ExcepcionSchema = z
  .object({
    _id: z.string().optional(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    tipoEntidad: z.enum(['Cliente', 'Alarma']).optional(),
    // ObjectId sin `ref` en el legacy (excepcion/schema.ts): sin x-ref.
    idEntidad: z.string().optional().meta({ 'x-bson': 'objectId' }),
    tipoExcepcion: z.enum(['Control Horario']).optional(),
    fechaDesde: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaHasta: z.string().optional().meta({ 'x-bson': 'date' }),

    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z.array(ClienteSchema).optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idsAncestros',
        foreignField: '_id',
        justOne: false,
      },
    }),
  })
  .meta({ 'x-collection': 'excepcions' });
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
