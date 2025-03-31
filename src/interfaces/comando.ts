import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";
import { IUsuario } from "./usuario";

export type IEstadoComando =
  | "Enviado"
  | "Recibido"
  | "Ejecutado"
  | "No Ejecutado";

export interface IComando {
  _id?: string;
  // Downlink
  deveui: string;
  puerto: number;
  payload: string;
  //
  nombre?: string; // Ej: Cambio dimerizacion
  descripcion?: string; /// Cambio dimerizacion 50%
  idCliente?: string;
  idUsuario?: string;
  fechaCreacion?: string; // Default: Date.now
  fechaActualizacion?: string;
  estado?: IEstadoComando; // Default: Enviado
  fallos?: number;
  fCnt?: string;

  // Virtuals
  cliente?: ICliente;
  usuario?: IUsuario;
  dispositivo?: IDispositivoLorawan;
}

type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "estado"
  | "cliente"
  | "usuario"
  | "dispositivo";
export interface ICreateComando extends Omit<Partial<IComando>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "usuario"
  | "dispositivo";
export interface IUpdateComando extends Omit<Partial<IComando>, OmitirUpdate> {}
