import { ICliente } from './cliente';

export interface IExcepcion {
  _id?: string;
  fechaCreacion?: string;
  idCliente?: string;
  idsAncestros?: string[];
  tipoEntidad?: 'Cliente' | 'Alarma';
  idEntidad?: string;
  tipoExcepcion?: 'Control Horario';
  fechaDesde?: string;
  fechaHasta?: string;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate =
  | '_id'
  | 'idsAncestros'
  //Virtuals
  | 'cliente'
  | 'ancestros';

export interface ICreateExcepcion
  extends Omit<Partial<IExcepcion>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'idsAncestros' | 'cliente' | 'ancestros';

export interface IUpdateExcepcion
  extends Omit<Partial<IExcepcion>, OmitirUpdate> {}

type OmitirCache = 'cliente' | 'ancestros';

export interface IExcepcionCache extends Omit<IExcepcion, OmitirCache> {}
