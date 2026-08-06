import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const LogTrackeoSchema = z
  .object({
    _id: z.string().optional(),
    expireAt: z.string().optional().meta({ 'x-bson': 'date' }),
    //
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idActivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),
    fecha: z.string().optional().meta({ 'x-bson': 'date' }),
    nuevaParada: z.boolean().optional(),
    indexUltimaParada: z.number().optional(),
    indexParadaActual: z.number().optional(),
    ultimaParada: z.string().optional(),
    paradaActual: z.string().optional(),
    totalParadas: z.number().optional(),
    motivo: z.string().optional(),

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
    activo: ActivoSchema.optional().meta({
      'x-populate': {
        ref: 'ActivoSchema',
        localField: 'idActivo',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'logtrackeos' });
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
