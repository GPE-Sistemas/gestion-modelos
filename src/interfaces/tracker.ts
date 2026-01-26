import { IActivo } from './activo';
import { ICliente } from './cliente';
import { ISim } from './dispositivo-alarma';
import { EstadoHabilitacion } from './estado-entidad';
import { IModeloDispositivo } from './modelo-dispositivo';
import { IServicioContratado } from './servicio-contratado';

export type TipoTracker = 'Qualcomm' | 'GPRS' | 'T1000-B' | 'Telefono';

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
  imagenes?: string[];
  idCliente?: string;
  idsAncestros?: string[];
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
  qualcomm?: IQualcommDevice;
  t1000b?: IT100bDevice;
  telefono?: ITelefono;
  estadoCuenta?: EstadoHabilitacion;
  numeroAbonado?: string;
  sim1?: ISim;
  sim2?: ISim;
  frecReporte?: number;
  //
  idServiciosContratados?: string[];
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  activo?: IActivo;
  modelo?: IModeloDispositivo;
  serviciosContratados?: IServicioContratado[];
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados';

export interface ICreateTracker extends Omit<Partial<ITracker>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados';

export interface IUpdateTracker extends Omit<Partial<ITracker>, OmitirUpdate> {}

export interface ITrackerCache
  extends Omit<
    ITracker,
    'cliente' | 'ancestros' | 'activo' | 'modelo' | 'serviciosContratados'
  > {}
