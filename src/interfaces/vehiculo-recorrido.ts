import { ICliente } from "./cliente";
import { IRecorrido } from "./recorrido";
import { IVehiculo } from "./vehiculo";

export interface IVehiculoRecorrido {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaEliminacion?: string;
  idCliente?: string;
  idVehiculo?: string;
  idRecorrido?: string;
  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
  recorrido?: IRecorrido;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo" | "recorrido";

export interface ICreateVehiculoRecorrido
  extends Omit<Partial<IVehiculoRecorrido>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo" | "recorrido";

export interface IUpdateVehiculoRecorrido
  extends Omit<Partial<IVehiculoRecorrido>, OmitirUpdate> {}
