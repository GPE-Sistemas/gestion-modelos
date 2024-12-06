import { ICliente } from './cliente';

export interface ILogDespacho {
  _id: string;
  idCliente?: string;
  fechaCreacion?: string;
  idExternoVehiculo?: string;
  idExternoRecorrido?: string;
  idExternoChofer?: string;
  // Populate
  cliente?: ICliente;
}

////// CREATE
type OmitirCreate = '_id' | 'fechaCreacion' | 'cliente';
export interface ICreateLogDespacho
  extends Omit<Partial<ILogDespacho>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = '_id' | 'fechaCreacion' | 'cliente';
export interface IUpdateLogDespacho
  extends Omit<Partial<ILogDespacho>, OmitirUpdate> {}
