import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IEvento } from "./evento";
import { IUsuario } from "./usuario";

export type EstadoEnvioVehiculo =
  | "Asignado"
  | "En Camino"
  | "Rechazado"
  | "Finalizado"
  | "En Destino";

export interface IEnvioVehiculo {
  _id?: string;
  fechaCreacion?: string;
  fechaFinalizacion?: string;
  descripcion?: string;
  estado?: EstadoEnvioVehiculo;
  ///
  idCliente?: string;
  idConductor?: string;
  idsEventos?: string[];
  //Usuario que lo crea
  idUsuario?: string;
  idActivo?: string;
  // Populate
  cliente?: ICliente;
  conductor?: IUsuario;
  usuario?: IUsuario;
  eventos?: IEvento[];
  activo?: IActivo;
}

type OmitirCreate =
  | "_id"
  | "usuario"
  | "activo"
  | "cliente"
  | "conductor"
  | "eventos";

export interface ICreateEnvioVehiculo
  extends Omit<Partial<IEnvioVehiculo>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "usuario"
  | "activo"
  | "cliente"
  | "conductor"
  | "eventos";

export interface IUpdateEnvioVehiculo
  extends Omit<Partial<IEnvioVehiculo>, OmitirUpdate> {}
