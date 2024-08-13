import { ICliente } from './cliente';

export interface IFlota {
  _id?: string;
  idCliente?: string;
  nombre?: string;
  color?: string;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = '_id' | 'cliente';

export interface ICreateFlota extends Omit<Partial<IFlota>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente';

export interface IUpdateFlota extends Omit<Partial<IFlota>, OmitirUpdate> {}
