import { ICliente } from './cliente';

export type ITipoListadoCategoria =
  //PARA TIPOS DE EVENTOS
  | 'Evento-Alarma'
  | 'Evento-Tracker'
  | 'Evento-Luminaria'
  | 'Evento-Sirena'
  | 'Evento-Gateway'
  | 'Evento-Activo'
  //PARA EMERGENCIAS MÉDICAS
  | 'Sintomas'
  | 'Diagnosticos'
  //PARA SERVICIOS TÉCNICOS
  | 'Evento-Tecnico-Tracker'
  | 'Evento-Tecnico-Alarma'
  | 'Evento-Tecnico-Vehiculo'
  | 'Evento-Tecnico-Luminaria'
  | 'Evento-Tecnico-Sirena'
  | 'Evento-Tecnico-Gateway'
  | 'Evento-Tecnico-Activo';

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
