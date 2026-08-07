import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const GrupoUsuarioSchema = z
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
    nombre: z.string().optional(),
    idAdmin: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    idsMiembros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),

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
    admin: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idAdmin',
        foreignField: '_id',
        justOne: true,
      },
    }),
    miembros: z.array(UsuarioSchema).optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idsMiembros',
        foreignField: '_id',
        justOne: false,
      },
    }),
  })
  .meta({ 'x-collection': 'grupousuarios' });
export type IGrupoUsuario = z.infer<typeof GrupoUsuarioSchema>;

export const CreateGrupoUsuarioSchema = GrupoUsuarioSchema.omit({
  _id: true,
  cliente: true,
  admin: true,
  miembros: true,
  fechaCreacion: true,
});
export type ICreateGrupoUsuario = z.infer<typeof CreateGrupoUsuarioSchema>;

export const UpdateGrupoUsuarioSchema = GrupoUsuarioSchema.omit({
  _id: true,
  cliente: true,
  admin: true,
  miembros: true,
  fechaCreacion: true,
});
export type IUpdateGrupoUsuario = z.infer<typeof UpdateGrupoUsuarioSchema>;

export const EstadoSolicitudGrupoUsuarioSchema = z.enum([
  'Pendiente',
  'Aceptada',
  'Rechazada',
]);
export type EstadoSolicitudGrupoUsuario = z.infer<
  typeof EstadoSolicitudGrupoUsuarioSchema
>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const SolicitudGrupoUsuarioSchema = z
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
    idGrupoUsuario: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'GrupoUsuarioSchema' }),
    idRemitente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    idDestinatario: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    estado: EstadoSolicitudGrupoUsuarioSchema.optional(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaRespuesta: z.string().optional().meta({ 'x-bson': 'date' }),

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
    grupoUsuario: GrupoUsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'GrupoUsuarioSchema',
        localField: 'idGrupoUsuario',
        foreignField: '_id',
        justOne: true,
      },
    }),
    remitente: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idRemitente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    destinatario: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idDestinatario',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'solicitudgrupousuarios' });
export type ISolicitudGrupoUsuario = z.infer<
  typeof SolicitudGrupoUsuarioSchema
>;

export const CreateSolicitudGrupoUsuarioSchema =
  SolicitudGrupoUsuarioSchema.omit({
    _id: true,
    cliente: true,
    grupoUsuario: true,
    remitente: true,
    destinatario: true,
    fechaCreacion: true,
    fechaRespuesta: true,
  });
export type ICreateSolicitudGrupoUsuario = z.infer<
  typeof CreateSolicitudGrupoUsuarioSchema
>;

export const UpdateSolicitudGrupoUsuarioSchema =
  SolicitudGrupoUsuarioSchema.omit({
    _id: true,
    cliente: true,
    grupoUsuario: true,
    remitente: true,
    destinatario: true,
    fechaCreacion: true,
    fechaRespuesta: true,
  });
export type IUpdateSolicitudGrupoUsuario = z.infer<
  typeof UpdateSolicitudGrupoUsuarioSchema
>;
