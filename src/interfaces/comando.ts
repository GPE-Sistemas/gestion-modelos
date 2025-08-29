import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export type IEstadoComando =
  | "Enviado"
  | "Recibido"
  | "No Recibido"
  | "Ejecutado"
  | "En Cola"
  | "No Ejecutado";

export interface IComando {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;
  nombre?: string;
  descripcion?: string;
  fechaCreacion?: string;
  payload?: string;
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

  // Virtuals
  tracker?: ITracker;
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  dispositivo?: IDispositivoLorawan;
}

type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "ancestros"
  | "usuario"
  | "tracker"
  | "dispositivo";
export interface ICreateComando extends Omit<Partial<IComando>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "usuario"
  | "ancestros"
  | "tracker"
  | "dispositivo";
export interface IUpdateComando extends Omit<Partial<IComando>, OmitirUpdate> {}
