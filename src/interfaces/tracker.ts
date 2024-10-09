import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IVehiculo } from "./vehiculo";

export type TipoTracker = "Qualcomm" | "Traccar";
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

export interface IQualcommDevice {
  // Datos de Qualcomm
  serialNumber?: string;
}

export interface ITracker {
  _id?: string;
  //
  idCliente?: string;
  nombre?: string;
  identificacion?: string;
  asignadoA?: string;
  tipo?: TipoTracker;
  /**
   * Id del tracker fisico
   */
  uniqueId?: string;
  traccar?: ITraccarDevice;
  qualcomm?: IQualcommDevice;

  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
  activo?: IActivo;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo" | "activo";

export interface ICreateTracker extends Omit<Partial<ITracker>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo" | "activo";

export interface IUpdateTracker extends Omit<Partial<ITracker>, OmitirUpdate> {}
