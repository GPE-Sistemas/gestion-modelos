import { IActivo } from './activo';
import { ICliente } from './cliente';
import { ITracker } from './tracker';

export interface IEventoTraccar {
  _id?: string;
  //
  traccarUniqueId?: string;
  idTracker?: string;
  idActivo?: string;
  idCliente?: string;
  tipo?: 'events' | 'devices';
  //
  fechaCreacion?: string;
  data?: Record<string, any>;
  ///
  tracker?: ITracker;
  activo?: IActivo;
  cliente?: ICliente;
}

type OmitirCreate = '_id' | 'fechaCreacion' | 'cliente' | 'tracker' | 'activo';

export interface ICreateEventoTraccar
  extends Omit<Partial<IEventoTraccar>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'fechaCreacion' | 'cliente' | 'tracker' | 'activo';

export interface IUpdateEventoTraccar
  extends Omit<Partial<IEventoTraccar>, OmitirUpdate> {}
