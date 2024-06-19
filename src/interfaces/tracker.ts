import { ICliente } from "./cliente";
import { IVehiculo } from "./vehiculo";

export interface ITraccarDevice {
  // Datos de traccar
  id?: number;
  name?: string;
  uniqueId?: string;
  status?: string;
  disabled?: true;
  lastUpdate?: string;
  positionId?: number;
  groupId?: number;
  phone?: string;
  model?: string;
  contact?: string;
  category?: string;
  attributes?: object;
}

export interface ITracker {
  _id?: string;
  //
  idCliente?: string;
  nombre?: string;
  identificacion?: string;
  asignadoA?: string;
  /**
   * Id del tracker fisico
   */
  uniqueId?: string;
  traccar?: ITraccarDevice;

  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo";

export interface ICreateTracker extends Omit<Partial<ITracker>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo";

export interface IUpdateTracker extends Omit<Partial<ITracker>, OmitirUpdate> {}
