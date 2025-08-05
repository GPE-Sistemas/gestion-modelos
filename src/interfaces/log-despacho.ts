import { ICliente } from './cliente';

export interface ILogDespacho {
  _id: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  idExternoVehiculo?: string;
  idExternoRecorrido?: string;
  idExternoChofer?: string;
  fecha?: string;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

////// CREATE
type OmitirCreate = '_id' | 'fechaCreacion' | 'cliente';
export interface ICreateLogDespacho
  extends Omit<Partial<ILogDespacho>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = '_id' | 'fechaCreacion' | 'cliente';
export interface IUpdateLogDespacho
  extends Omit<Partial<ILogDespacho>, OmitirUpdate> {}
