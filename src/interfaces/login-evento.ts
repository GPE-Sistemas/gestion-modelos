import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

export const MetodoLoginSchema = z.enum(['password', 'google']);
export type MetodoLogin = z.infer<typeof MetodoLoginSchema>;

export const PlataformaLoginSchema = z.enum([
  'web',
  'android',
  'ios',
  'desconocida',
]);
export type PlataformaLogin = z.infer<typeof PlataformaLoginSchema>;

/**
 * Evento de login de un usuario. Se inserta uno por login exitoso (grant
 * password o Google / auto-registro), NO en los refresh de token.
 *
 * Sirve para las estadísticas de uso (DAU/WAU/MAU, series temporales, rachas,
 * agregados por cliente). Se denormalizan `usuario`, `idCliente` e
 * `idsAncestros` en el momento del login para poder agrupar por jerarquía de
 * clientes sin joins y para que la métrica sobreviva aunque el usuario cambie
 * de cliente más adelante.
 *
 * La colección tiene un índice TTL sobre `fecha` (retención 1 año).
 */
export const LoginEventoSchema = z.object({
  _id: z.string().optional(),
  // Vínculo con el usuario que inició sesión.
  idUsuario: z.string().optional(),
  // Nombre de usuario denormalizado (lowercase), por si el usuario se borra.
  usuario: z.string().optional(),
  // Cliente del usuario al momento del login (puede no tener).
  idCliente: z.string().optional(),
  // Cadena de clientes ancestros del idCliente, para roll-up por subárbol.
  idsAncestros: z.array(z.string()).optional(),
  // Momento del login. Ancla del índice TTL.
  fecha: z.string().optional(),
  metodo: MetodoLoginSchema.optional(),
  plataforma: PlataformaLoginSchema.optional(),
  // User-Agent crudo (best-effort), por si luego se quiere afinar plataforma.
  userAgent: z.string().optional(),
  // Populate / Virtual
  usuarioDoc: UsuarioSchema.optional(),
  cliente: ClienteSchema.optional(),
});
export type ILoginEvento = z.infer<typeof LoginEventoSchema>;

export const CreateLoginEventoSchema = LoginEventoSchema.omit({
  _id: true,
  usuarioDoc: true,
  cliente: true,
});
export type ICreateLoginEvento = z.infer<typeof CreateLoginEventoSchema>;

// ---- Tipos de retorno de las estadísticas de uso (solo lectura) ----

export const EstadisticasResumenSchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
  // Usuarios activos únicos en las últimas 24h / 7d / 30d.
  dau: z.number().optional(),
  wau: z.number().optional(),
  mau: z.number().optional(),
  // Totales dentro del rango [desde, hasta].
  totalLogins: z.number().optional(),
  usuariosActivos: z.number().optional(),
  // Universo total de usuarios registrados (con y sin actividad).
  usuariosRegistrados: z.number().optional(),
});
export type IEstadisticasResumen = z.infer<typeof EstadisticasResumenSchema>;

export const EstadisticasSeriePuntoSchema = z.object({
  fecha: z.string().optional(), // día (YYYY-MM-DD)
  logins: z.number().optional(),
  usuariosActivos: z.number().optional(),
});
export type IEstadisticasSeriePunto = z.infer<
  typeof EstadisticasSeriePuntoSchema
>;

export const EstadisticasPorClienteSchema = z.object({
  idCliente: z.string().optional(),
  nombre: z.string().optional(),
  nivel: z.number().optional(),
  totalLogins: z.number().optional(),
  usuariosActivos: z.number().optional(),
  dau: z.number().optional(),
  wau: z.number().optional(),
  mau: z.number().optional(),
});
export type IEstadisticasPorCliente = z.infer<
  typeof EstadisticasPorClienteSchema
>;

export const EstadisticasPorUsuarioSchema = z.object({
  idUsuario: z.string().optional(),
  usuario: z.string().optional(),
  nombre: z.string().optional(),
  idCliente: z.string().optional(),
  clienteNombre: z.string().optional(),
  ultimoLogin: z.string().optional(),
  primerLogin: z.string().optional(),
  cantidadLogins: z.number().optional(), // acumulado histórico (contador en Usuario)
  loginsRango: z.number().optional(), // logins dentro de [desde, hasta]
  diasActivosRango: z.number().optional(), // días distintos con al menos un login en el rango
  rachaActual: z.number().optional(), // días consecutivos activos hasta hoy
  diasDesdeUltimoLogin: z.number().optional(),
  plataformas: z.array(z.string()).optional(),
  metodos: z.array(z.string()).optional(),
});
export type IEstadisticasPorUsuario = z.infer<
  typeof EstadisticasPorUsuarioSchema
>;
