import { ICliente } from "./cliente";
import { IFlota } from "./flota";
import { IRecorrido } from "./recorrido";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export type TipoVehiculo =
  | "Colectivo"
  | "Policia"
  | "Ambulancia"
  | "Bomberos"
  | "Particular"
  | "Camion"
  | "Moto"
  | "Otro";

export type EstadoVehiculo =
  | "Operativo"
  | "En mantenimiento"
  | "Fuera de servicio";

export interface IVehiculo {
  _id?: string;
  //
  idCliente?: string;
  tipo?: TipoVehiculo;
  identificacion?: string;
  patente?: string;
  estado?: EstadoVehiculo;
  //
  idChofer?: string;
  idFlota?: string;
  idRecorrido?: string;
  idsRecorridos?: string[];
  /**
   * El id del tracker asignado en la plataforma traccar para obtener el vehiculo rapido con los reportes de traccar
   */
  idUnicoTraccar?: number;
  // Populate
  cliente?: ICliente;
  chofer?: IUsuario;
  flota?: IFlota;
  recorrido?: IRecorrido;
  recorridos?: IRecorrido[];
  tracker?: ITracker;
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "chofer"
  | "flota"
  | "recorrido"
  | "recorridos"
  | "tracker";

export interface ICreateVehiculo
  extends Omit<Partial<IVehiculo>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "chofer"
  | "flota"
  | "recorrido"
  | "recorridos"
  | "tracker";

export interface IUpdateVehiculo
  extends Omit<Partial<IVehiculo>, OmitirUpdate> {}
