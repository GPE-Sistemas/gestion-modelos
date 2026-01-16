import { ICliente } from './cliente';
import { IActivo } from './activo';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type IEntidades = 'Chofer' | 'Activo' | 'Tracker';

export interface IAsignacion {
  _id?: string;
  //
  fechaAsignacion?: Date;
  fechaDesasignacion?: Date;
  idCliente?: string;
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
  ChoferModificado?: IUsuario;
  ActivoModificado?: IActivo;
  TrackerModificado?: ITracker;
  ChoferAsignado?: IUsuario;
  ActivoAsignado?: IActivo;
  TrackerAsignado?: ITracker;
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'usuario'
  | 'ChoferModificado'
  | 'ActivoModificado'
  | 'TrackerModificado'
  | 'ChoferAsignado'
  | 'ActivoAsignado'
  | 'TrackerAsignado';

export interface ICreateAsignacion
  extends Omit<Partial<IAsignacion>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'usuario'
  | 'ChoferModificado'
  | 'ActivoModificado'
  | 'TrackerModificado'
  | 'ChoferAsignado'
  | 'ActivoAsignado'
  | 'TrackerAsignado';

export interface IUpdateAsignacion
  extends Omit<Partial<IAsignacion>, OmitirUpdate> {}
