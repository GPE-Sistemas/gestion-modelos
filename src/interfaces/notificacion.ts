import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

export const NotificacionSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idUsuario: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fechaLeido: z.string().optional(),
  leido: z.boolean().optional(),
  archivado: z.boolean().optional(),
  titulo: z.string().optional(),
  mensaje: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  usuario: UsuarioSchema.optional(),
});
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
