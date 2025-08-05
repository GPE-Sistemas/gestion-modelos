import { ICliente } from './cliente';

export interface IApikey {
  _id?: string;
  //
  identificacion?: string;
  key?: string;
  // Permisos
  global?: boolean; // Si es global, no se le asignan clientes
  idCreador?: string; // Si es global. Es lo que puede ver ese cliente.
  idClientes?: string[]; // Si no es global, se le asignan clientes
  modulos?: Modulo[]; // Flotas - Alarmas - etc

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[]; // Este sería el creador
  clientes?: ICliente[]; // Estos son los elegidos para ver
}

type OmitirCreate = '_id' | 'clientes';

export interface ICreateApikey extends Omit<Partial<IApikey>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'clientes';

export interface IUpdateApikey extends Omit<Partial<IApikey>, OmitirUpdate> {}

export type Modulo = 'flotas' | 'alarmas';
