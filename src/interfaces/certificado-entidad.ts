import { IActivo } from './activo';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { IEventoGenerico } from './evento-generico';
import { ITracker } from './tracker';

export interface ICertificadoEntidad {
  _id?: string;
  //
  idCliente?: string;
  idEntidad?: string;
  fechaEmision?: string;
  eventosRegistrados?: IEventoGenerico[];
  idsAncestros?: string[];

  // Populate
  tracker?: ITracker;
  activo?: IActivo;
  alarma?: IDispositivoAlarma;
}

type OmitirCreate = '_id' | 'cliente' | 'tracker' | 'alarma' | 'activo';

export interface ICreateCertificadoEntidad
  extends Omit<Partial<ICertificadoEntidad>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'tracker' | 'alarma' | 'activo';

export interface IUpdateCertificadoEntidad
  extends Omit<Partial<ICertificadoEntidad>, OmitirUpdate> {}
