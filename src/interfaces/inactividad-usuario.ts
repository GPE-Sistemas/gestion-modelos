import { ICliente } from './cliente';
import { IUsuario } from './usuario';

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
export interface IInactividadUsuario {
  _id?: string;
  // Vínculo con el usuario.
  idUsuario?: string;
  // Nombre de usuario denormalizado (lowercase), por si el usuario se borra.
  usuario?: string;
  // Cliente del permiso activo al momento del evento.
  idCliente?: string;
  // Cadena de clientes ancestros del idCliente, para roll-up por subárbol.
  idsAncestros?: string[];
  // Momento en que venció el cartel sin confirmación. Ancla del índice TTL.
  inicio?: string;
  // Momento en que volvió a confirmar actividad. Ausente = intervalo abierto.
  // La duración de la inactividad es `fin - inicio`.
  fin?: string;
  // Populate / Virtual
  usuarioDoc?: IUsuario;
  cliente?: ICliente;
}

type OmitirCreate = '_id' | 'fin' | 'usuarioDoc' | 'cliente';

export interface ICreateInactividadUsuario
  extends Omit<Partial<IInactividadUsuario>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'usuarioDoc' | 'cliente';

export interface IUpdateInactividadUsuario
  extends Omit<Partial<IInactividadUsuario>, OmitirUpdate> {}
