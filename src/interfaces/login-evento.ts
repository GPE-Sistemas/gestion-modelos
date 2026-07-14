import { ICliente } from './cliente';
import { IUsuario } from './usuario';

export type MetodoLogin = 'password' | 'google';
export type PlataformaLogin = 'web' | 'android' | 'ios' | 'desconocida';

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
export interface ILoginEvento {
  _id?: string;
  // Vínculo con el usuario que inició sesión.
  idUsuario?: string;
  // Nombre de usuario denormalizado (lowercase), por si el usuario se borra.
  usuario?: string;
  // Cliente del usuario al momento del login (puede no tener).
  idCliente?: string;
  // Cadena de clientes ancestros del idCliente, para roll-up por subárbol.
  idsAncestros?: string[];
  // Momento del login. Ancla del índice TTL.
  fecha?: string;
  metodo?: MetodoLogin;
  plataforma?: PlataformaLogin;
  // User-Agent crudo (best-effort), por si luego se quiere afinar plataforma.
  userAgent?: string;
  // Populate / Virtual
  usuarioDoc?: IUsuario;
  cliente?: ICliente;
}

type OmitirCreate = '_id' | 'usuarioDoc' | 'cliente';

export interface ICreateLoginEvento
  extends Omit<Partial<ILoginEvento>, OmitirCreate> {}

// ---- Tipos de retorno de las estadísticas de uso (solo lectura) ----

export interface IEstadisticasResumen {
  desde?: string;
  hasta?: string;
  // Usuarios activos únicos en las últimas 24h / 7d / 30d.
  dau?: number;
  wau?: number;
  mau?: number;
  // Totales dentro del rango [desde, hasta].
  totalLogins?: number;
  usuariosActivos?: number;
  // Universo total de usuarios registrados (con y sin actividad).
  usuariosRegistrados?: number;
}

export interface IEstadisticasSeriePunto {
  fecha?: string; // día (YYYY-MM-DD)
  logins?: number;
  usuariosActivos?: number;
}

export interface IEstadisticasPorCliente {
  idCliente?: string;
  nombre?: string;
  nivel?: number;
  totalLogins?: number;
  usuariosActivos?: number;
  dau?: number;
  wau?: number;
  mau?: number;
}

export interface IEstadisticasPorUsuario {
  idUsuario?: string;
  usuario?: string;
  nombre?: string;
  idCliente?: string;
  clienteNombre?: string;
  ultimoLogin?: string;
  primerLogin?: string;
  cantidadLogins?: number; // acumulado histórico (contador en Usuario)
  loginsRango?: number; // logins dentro de [desde, hasta]
  diasActivosRango?: number; // días distintos con al menos un login en el rango
  rachaActual?: number; // días consecutivos activos hasta hoy
  diasDesdeUltimoLogin?: number;
  plataformas?: string[];
  metodos?: string[];
}
