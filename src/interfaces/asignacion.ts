import { ICliente } from './cliente';
import { IActivo } from './activo';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type IEntidades = 'Chofer' | 'Activo' | 'Tracker';

export interface IAsignacion {
  _id?: string;
  //
  fechaAsignacion?: string;
  fechaDesasignacion?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;

  // Id de la entidad a la que se le asigna algo
  idEntidadModificada?: string;
  tipoEntidadModificada?: IEntidades;
  nombreEntidadModificada?: string;
  // Id de la entidad que se asigna a la otra
  idEntidadAsignada?: string;
  tipoEntidadAsignada?: IEntidades;
  nombreEntidadAsignada?: string;

  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
  choferModificado?: IUsuario;
  activoModificado?: IActivo;
  trackerModificado?: ITracker;
  choferAsignado?: IUsuario;
  activoAsignado?: IActivo;
  trackerAsignado?: ITracker;
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'usuario'
  | 'choferModificado'
  | 'activoModificado'
  | 'trackerModificado'
  | 'choferAsignado'
  | 'activoAsignado'
  | 'trackerAsignado';

export interface ICreateAsignacion extends Omit<
  Partial<IAsignacion>,
  OmitirCreate
> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'usuario'
  | 'choferModificado'
  | 'activoModificado'
  | 'trackerModificado'
  | 'choferAsignado'
  | 'activoAsignado'
  | 'trackerAsignado';

export interface IUpdateAsignacion extends Omit<
  Partial<IAsignacion>,
  OmitirUpdate
> {}
