import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

/**
 * Tipo de registro de actividad de usuario:
 * - `Inactividad`: el operador no confirmó el cartel de actividad a tiempo
 *   (intervalo `inicio`→`fin`; sin `fin` = intervalo abierto).
 * - `Actividad`: el uso continuo superó el límite y se mostró el banner de
 *   descanso (registro puntual; `fin` = momento del aviso de descanso).
 */
export const TipoActividadUsuarioSchema = z.enum(['Inactividad', 'Actividad']);
export type TipoActividadUsuario = z.infer<typeof TipoActividadUsuarioSchema>;

/**
 * Registro del control de actividad de operadores (cliente.config.
 * controlInactividad / controlActividad), generado por el frontend
 * (gestion-web-cliente). Un mismo documento cubre los dos controles vía el
 * campo `tipo`; el modelo de datos es idéntico, sólo cambia la semántica de
 * `inicio`/`fin`.
 *
 * api-gestion arma el documento desde el request (usuario del token,
 * `idCliente` del permiso activo); `idsAncestros` lo denormaliza api-datos
 * por hook a partir del `idCliente`. TTL 1 año sobre `inicio`.
 */
export const ActividadUsuarioSchema = z.object({
  _id: z.string().optional(),
  // Discrimina inactividad vs periodo de actividad.
  tipo: TipoActividadUsuarioSchema.optional(),
  // Vínculo con el usuario.
  idUsuario: z.string().optional(),
  // Nombre de usuario denormalizado (lowercase), por si el usuario se borra.
  usuario: z.string().optional(),
  // Cliente del permiso activo al momento del evento.
  idCliente: z.string().optional(),
  // Cadena de clientes ancestros del idCliente, para roll-up por subárbol.
  idsAncestros: z.array(z.string()).optional(),
  // Inactividad: momento en que venció el cartel sin confirmación.
  // Actividad: comienzo del ciclo de uso. Ancla del índice TTL.
  inicio: z.string().optional(),
  // Inactividad: momento en que volvió a confirmar (ausente = intervalo
  // abierto). Actividad: momento del aviso de descanso. La duración es
  // `fin - inicio`.
  fin: z.string().optional(),
  // Populate / Virtual
  usuarioDoc: UsuarioSchema.optional(),
  cliente: ClienteSchema.optional(),
});
export type IActividadUsuario = z.infer<typeof ActividadUsuarioSchema>;

export const CreateActividadUsuarioSchema = ActividadUsuarioSchema.omit({
  _id: true,
  usuarioDoc: true,
  cliente: true,
});
export type ICreateActividadUsuario = z.infer<
  typeof CreateActividadUsuarioSchema
>;

export const UpdateActividadUsuarioSchema = ActividadUsuarioSchema.omit({
  _id: true,
  usuarioDoc: true,
  cliente: true,
});
export type IUpdateActividadUsuario = z.infer<
  typeof UpdateActividadUsuarioSchema
>;
