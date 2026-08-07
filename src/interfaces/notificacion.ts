import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const NotificacionSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idUsuario: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    // Sin cast: no está en el schema legacy (agregado a Fields en el meta.go
    // por drift 2026-08-04, pero nunca tuvo @Prop({type: Date})).
    fechaLeido: z.string().optional(),
    leido: z.boolean().optional(),
    archivado: z.boolean().optional(),
    titulo: z.string().optional(),
    mensaje: z.string().optional(),

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
    usuario: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idUsuario',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'notificacions' });
export type INotificacion = z.infer<typeof NotificacionSchema>;

export const CreateNotificacionSchema = NotificacionSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
});
export type ICreateNotificacion = z.infer<typeof CreateNotificacionSchema>;

export const UpdateNotificacionSchema = NotificacionSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
});
export type IUpdateNotificacion = z.infer<typeof UpdateNotificacionSchema>;
