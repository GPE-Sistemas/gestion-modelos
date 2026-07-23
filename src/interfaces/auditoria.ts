import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

export const AccionAuditoriaSchema = z.enum(['Crear', 'Editar', 'Eliminar', 'Ver']);
export type AccionAuditoria = z.infer<typeof AccionAuditoriaSchema>;

export const AuditoriaSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  idUsuario: z.string().optional(),
  nombreUsuario: z.string().optional(), // se persiste por si se borra el usuario
  entidad: z.string().optional(), // 'activos', 'usuarios', 'clientes', etc.
  subPath: z.string().optional(), // Lo que sigue en la ruta despues de la entidad
  idEntidad: z.string().optional(), // ID del documento afectado
  accion: AccionAuditoriaSchema.optional(),
  cambios: z.record(z.string(), z.unknown()).optional(), // { campo: valorNuevo }
  valoresAnteriores: z.record(z.string(), z.unknown()).optional(), // { campo: valorAntes } — solo para Editar
  camposModificados: z.array(z.string()).optional(), // ['nombre', 'descripcion'] — indexable

  // Populate
  usuario: UsuarioSchema.optional(),
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IAuditoria = z.infer<typeof AuditoriaSchema>;

export const CreateAuditoriaSchema = AuditoriaSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type ICreateAuditoria = z.infer<typeof CreateAuditoriaSchema>;

/// LAS AUDITORIAS SON INMUTABLES, FER.
