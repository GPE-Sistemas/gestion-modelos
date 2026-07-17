import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

export const GrupoUsuarioSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  nombre: z.string().optional(),
  idAdmin: z.string().optional(),
  idsMiembros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  admin: UsuarioSchema.optional(),
  miembros: z.array(UsuarioSchema).optional(),
});
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

export const SolicitudGrupoUsuarioSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idGrupoUsuario: z.string().optional(),
  idRemitente: z.string().optional(),
  idDestinatario: z.string().optional(),
  estado: EstadoSolicitudGrupoUsuarioSchema.optional(),
  fechaCreacion: z.string().optional(),
  fechaRespuesta: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  grupoUsuario: GrupoUsuarioSchema.optional(),
  remitente: UsuarioSchema.optional(),
  destinatario: UsuarioSchema.optional(),
});
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
