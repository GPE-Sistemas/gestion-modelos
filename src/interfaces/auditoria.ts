import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

export const AccionAuditoriaSchema = z.enum(['Crear', 'Editar', 'Eliminar', 'Ver']);
export type AccionAuditoria = z.infer<typeof AccionAuditoriaSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const AuditoriaSchema = z
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
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    idUsuario: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    nombreUsuario: z.string().optional(), // se persiste por si se borra el usuario
    entidad: z.string().optional(), // 'activos', 'usuarios', 'clientes', etc.
    subPath: z.string().optional(), // Lo que sigue en la ruta despues de la entidad
    // @Prop({type: String}) en el legacy — sin casting, no es un ObjectId.
    idEntidad: z.string().optional(), // ID del documento afectado
    accion: AccionAuditoriaSchema.optional(),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    cambios: z.record(z.string(), z.unknown()).optional().meta({
      'x-bson': 'mixed',
    }), // { campo: valorNuevo }
    valoresAnteriores: z.record(z.string(), z.unknown()).optional().meta({
      'x-bson': 'mixed',
    }), // { campo: valorAntes } — solo para Editar
    camposModificados: z.array(z.string()).optional(), // ['nombre', 'descripcion'] — indexable

    // Populate
    usuario: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idUsuario',
        foreignField: '_id',
        justOne: true,
      },
    }),
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
  .meta({ 'x-collection': 'auditorias' });
export type IAuditoria = z.infer<typeof AuditoriaSchema>;

export const CreateAuditoriaSchema = AuditoriaSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type ICreateAuditoria = z.infer<typeof CreateAuditoriaSchema>;

/// LAS AUDITORIAS SON INMUTABLES, FER.
