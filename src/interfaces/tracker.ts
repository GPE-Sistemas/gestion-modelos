import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IModeloDispositivo } from "./modelo-dispositivo";

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
  idModelo?: IModeloDispositivo;
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
  activo?: IActivo;
  modelo?: IModeloDispositivo;
}

type OmitirCreate = "_id" | "cliente" | "activo" | "modelo";

export interface ICreateTracker extends Omit<Partial<ITracker>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "activo" | "modelo";

export interface IUpdateTracker extends Omit<Partial<ITracker>, OmitirUpdate> {}
