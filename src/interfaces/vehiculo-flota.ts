import { ICliente } from "./cliente";
import { IFlota } from "./flota";
import { IVehiculo } from "./vehiculo";

export interface IVehiculoFlota {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaEliminacion?: string;
  idCliente?: string;
  idVehiculo?: string;
  idFlota?: string;
  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
  flota?: IFlota;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo" | "flota";

export interface ICreateVehiculoFlota
  extends Omit<Partial<IVehiculoFlota>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo" | "flota";

export interface IUpdateVehiculoFlota
  extends Omit<Partial<IVehiculoFlota>, OmitirUpdate> {}
