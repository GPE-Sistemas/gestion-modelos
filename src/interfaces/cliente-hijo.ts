import { ICliente } from './cliente';

export interface IClienteHijo {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idHijo?: string;
  nivelCliente?: number;
  nivelHijo?: number;
  //
  cliente?: ICliente;
  ancestros?: ICliente[];
  hijo?: ICliente;
}

type OmitirCreate = '_id' | 'cliente' | 'hijo';
export interface ICreateClienteHijo
  extends Omit<Partial<IClienteHijo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'hijo';
export interface IUpdateClienteHijo
  extends Omit<Partial<IClienteHijo>, OmitirUpdate> {}
