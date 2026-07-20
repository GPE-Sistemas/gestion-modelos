import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

/**
 * Intervalo de inactividad de un usuario, generado por el control de
 * inactividad del frontend (cliente.config.controlInactividad).
 *
 * Se crea cuando el usuario NO confirma el cartel de actividad dentro del
 * tiempo límite (pasa a inactivo) y se cierra (`fin`) cuando vuelve a
 * confirmar. Un intervalo sin `fin` significa que el usuario nunca confirmó
 * (cerró el navegador / expiró la sesión estando inactivo).
 *
 * api-gestion arma el documento desde el request (usuario del token,
 * `idCliente` del permiso activo); `idsAncestros` lo denormaliza api-datos
 * por hook a partir del `idCliente`. TTL 1 año sobre `inicio`.
 */
export const InactividadUsuarioSchema = z.object({
  _id: z.string().optional(),
  // Vínculo con el usuario.
  idUsuario: z.string().optional(),
  // Nombre de usuario denormalizado (lowercase), por si el usuario se borra.
  usuario: z.string().optional(),
  // Cliente del permiso activo al momento del evento.
  idCliente: z.string().optional(),
  // Cadena de clientes ancestros del idCliente, para roll-up por subárbol.
  idsAncestros: z.array(z.string()).optional(),
  // Momento en que venció el cartel sin confirmación. Ancla del índice TTL.
  inicio: z.string().optional(),
  // Momento en que volvió a confirmar actividad. Ausente = intervalo abierto.
  // La duración de la inactividad es `fin - inicio`.
  fin: z.string().optional(),
  // Populate / Virtual
  usuarioDoc: UsuarioSchema.optional(),
  cliente: ClienteSchema.optional(),
});
export type IInactividadUsuario = z.infer<typeof InactividadUsuarioSchema>;

export const CreateInactividadUsuarioSchema = InactividadUsuarioSchema.omit({
  _id: true,
  fin: true,
  usuarioDoc: true,
  cliente: true,
});
export type ICreateInactividadUsuario = z.infer<
  typeof CreateInactividadUsuarioSchema
>;

export const UpdateInactividadUsuarioSchema = InactividadUsuarioSchema.omit({
  _id: true,
  usuarioDoc: true,
  cliente: true,
});
export type IUpdateInactividadUsuario = z.infer<
  typeof UpdateInactividadUsuarioSchema
>;
