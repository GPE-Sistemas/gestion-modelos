import { ICliente } from './cliente';

export type ITipoListadoCategoria =
  | 'Evento Alarma'
  | 'Evento Tracker'
  | 'Evento Luminaria'
  | 'Síntomas'
  | 'Diagnósticos'
  | 'Evento Técnico Tracker'
  | 'Evento Técnico Alarma'
  | 'Evento Técnico Vehículo'
  | 'Evento Técnico Luminaria'
  | 'Evento Técnico Sirena'
  | 'Evento Técnico Gateway';

export interface IListadoCategoria {
  _id?: string;
  //
  nombre?: string;
  categoria?: ITipoListadoCategoria;
  idCliente?: string;
  idsAncestros?: string[];
  default?: boolean;
  global?: boolean;
  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'cliente';

export interface ICreateListadoCategoria extends Omit<
  Partial<IListadoCategoria>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente';

export interface IUpdateListadoCategoria extends Omit<
  Partial<IListadoCategoria>,
  OmitirUpdate
> {}

export interface IListadoCategoriaCache extends Omit<
  IListadoCategoria,
  'cliente' | 'ancestros'
> {}
