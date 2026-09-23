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

    // Los reenvíos por socket guardan el protocolo real; los que van por HTTP
    // guardan el nombre de la integración (así los escribe gestion-trackers-go
    // desde siempre para Soflex e Iron Tracking). Es lo que usa el filtro
    // "Tipo de reenvío" del listado de logs.
    protocolo: z
      .enum([
        'UDP',
        'TCP',
        'Soflex',
        'Iron Tracking',
        'Logictracker',
        'Objetivo AVL',
      ])
      .optional(),
    host: z.string().optional(),
    puerto: z.number().optional(),
    // Solo reenvíos HTTP: método y headers tal cual salieron, credenciales
    // incluidas (decisión explícita: es lo que se le pasa al proveedor para
    // validar la autenticación). Mixed: el nombre de cada header es la clave.
    metodoHttp: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional().meta({
      'x-bson': 'mixed',
    }),
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
