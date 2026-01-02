import { IActivo } from './activo';
import { ICliente } from './cliente';
import { ICodigoDispositivo } from './codigos-dispositivo';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { IEventoGenerico } from './evento-generico';
import { ITracker } from './tracker';

export interface ICertificadoEntidad {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  //
  idEntidad?: string;
  fechaComienzo?: string;
  fechaEmision?: string;
  eventosRegistrados?: IEventoGenerico[];
  codigosEsperados?: ICodigoDispositivo[];
  // Populate
  tracker?: ITracker;
  activo?: IActivo;
  alarma?: IDispositivoAlarma;
  cliente?: ICliente;
}

type OmitirCreate = '_id' | 'cliente' | 'tracker' | 'alarma' | 'activo';

export interface ICreateCertificadoEntidad
  extends Omit<Partial<ICertificadoEntidad>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'tracker' | 'alarma' | 'activo';

export interface IUpdateCertificadoEntidad
  extends Omit<Partial<ICertificadoEntidad>, OmitirUpdate> {}
