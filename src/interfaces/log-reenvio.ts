import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { DispositivoAlarmaSchema } from './dispositivo-alarma';
import { TrackerSchema } from './tracker';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const LogReenvioSchema = z
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
    fecha: z.string().optional().meta({ 'x-bson': 'date' }),
    // Sin x-ref propio: se popula bajo los nombres "dispositivoAlarma"/
    // "tracker" (virtuals con nombre distinto al path).
    idEntidad: z.string().optional().meta({ 'x-bson': 'objectId' }),

    protocolo: z.enum(['UDP', 'TCP']).optional(),
    host: z.string().optional(),
    puerto: z.number().optional(),
    body: z.string().optional(),
    ack: z.boolean().optional(),
    error: z.string().optional(),

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
    dispositivoAlarma: DispositivoAlarmaSchema.optional().meta({
      'x-populate': {
        ref: 'DispositivoAlarmaSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
    tracker: TrackerSchema.optional().meta({
      'x-populate': {
        ref: 'TrackerSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'logreenvios' });
export type ILogReenvio = z.infer<typeof LogReenvioSchema>;

export const CreateLogReenvioSchema = LogReenvioSchema.omit({
  _id: true,
  cliente: true,
  dispositivoAlarma: true,
  tracker: true,
});
export type ICreateLogReenvio = z.infer<typeof CreateLogReenvioSchema>;

export const UpdateLogReenvioSchema = LogReenvioSchema.omit({
  _id: true,
  cliente: true,
  dispositivoAlarma: true,
  tracker: true,
});
export type IUpdateLogReenvio = z.infer<typeof UpdateLogReenvioSchema>;
