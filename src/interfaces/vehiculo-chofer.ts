import { IChofer } from "./chofer";
import { ICliente } from "./cliente";
import { IVehiculo } from "./vehiculo";

export interface IVehiculoChofer {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaEliminacion?: string;
  idCliente?: string;
  idVehiculo?: string;
  idChofer?: string;
  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
  chofer?: IChofer;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo" | "chofer";

export interface ICreateVehiculoChofer
  extends Omit<Partial<IVehiculoChofer>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo" | "chofer";

export interface IUpdateVehiculoChofer
  extends Omit<Partial<IVehiculoChofer>, OmitirUpdate> {}
