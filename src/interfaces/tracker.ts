import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { ISim } from "./dispositivo-alarma";
import { estadoCuenta } from "./estado-entidad";
import { IModeloDispositivo } from "./modelo-dispositivo";
import { IServicioContratado } from "./servicio-contratado";

export type TipoTracker = "Qualcomm" | "Traccar" | "T1000-B";
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

export interface IT100bDevice {
  deveui?: string;
}
export interface IQualcommDevice {
  // Datos de Qualcomm
  serialNumber?: string;
}

export interface ITelefono {
  deviceId?: string;
}

export interface ITracker {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaAlta?: string;
  idCliente?: string;
  idsClientesQuePuedenAtenderEventos?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  idModelo?: string;
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
  t1000b?: IT100bDevice;
  telefono?: ITelefono;
  estadoCuenta?: estadoCuenta;
  numeroAbonado?: string;
  sim1?: ISim;
  sim2?: ISim;
  frecReporte?: number;
  //
  idServiciosContratados?: string[];
  // Populate
  cliente?: ICliente;
  activo?: IActivo;
  modelo?: IModeloDispositivo;
  serviciosContratados?: IServicioContratado[];
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "activo"
  | "modelo"
  | "serviciosContratados";

export interface ICreateTracker extends Omit<Partial<ITracker>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "activo"
  | "modelo"
  | "serviciosContratados";

export interface IUpdateTracker extends Omit<Partial<ITracker>, OmitirUpdate> {}
