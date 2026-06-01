import { ICliente } from './cliente';
import { IDispositivoLorawan } from './dispositivo-lorawan';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type IEstadoComando =
  | 'Enviado'
  | 'Recibido'
  | 'No Recibido'
  | 'Ejecutado'
  | 'En Cola'
  | 'No Ejecutado'
  | 'Descartado';

/**
 * Nivel/objetivo desde el que se origina un comando o downlink.
 *
 * Eje de PROCEDENCIA (qué entidad/acción originó el comando), ortogonal al `origen` (`OrigenDownlinkJob`, que es el eje de POLÍTICA: cómo se trata el
 * downlink).
 */
export type NivelObjetivo = 'luminaria' | 'grupo' | 'puesta' | 'grupoPuesta';

export interface IObjetivoComando {
  nivel: NivelObjetivo;
  id: string; // _id del objetivo (luminaria / grupo de luminarias/ puesta / grupo de puestas)
  nombre?: string; // Denormalizado para que la UI muestre sin populate
}

export interface IComando {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;
  nombre?: string;
  descripcion?: string;
  fechaCreacion?: string;
  payload?: string;
  datosExtra?: Record<string, any>;
  // Tracker
  idTracker?: string;
  respuesta?: string;
  // lorawan
  // Downlink
  deveui?: string;
  puerto?: number;
  //
  fechaActualizacion?: string;
  estado?: IEstadoComando; // Default: Enviado
  fallos?: number;
  fCnt?: string;
  idChirpstack?: string;
  objetivo?: IObjetivoComando; // Procedencia: desde qué nivel/entidad se originó (luminaria/grupo/puesta/punto-alim)

  // Virtuals
  tracker?: ITracker;
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  dispositivo?: IDispositivoLorawan;
}

type OmitirCreate =
  | '_id'
  | 'fechaCreacion'
  | 'cliente'
  | 'ancestros'
  | 'usuario'
  | 'tracker'
  | 'dispositivo';
export interface ICreateComando extends Omit<Partial<IComando>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'cliente'
  | 'usuario'
  | 'ancestros'
  | 'tracker'
  | 'dispositivo';
export interface IUpdateComando extends Omit<Partial<IComando>, OmitirUpdate> {}
