import { ICliente } from "./cliente";
import { ITracker } from "./tracker";
import { IVehiculo } from "./vehiculo";

export interface IVehiculoTracker {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaEliminacion?: string;
  idCliente?: string;
  idVehiculo?: string;
  idTracker?: string;
  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
  tracker?: ITracker;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo" | "tracker";

export interface ICreateVehiculoTracker
  extends Omit<Partial<IVehiculoTracker>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo" | "tracker";

export interface IUpdateVehiculoTracker
  extends Omit<Partial<IVehiculoTracker>, OmitirUpdate> {}
