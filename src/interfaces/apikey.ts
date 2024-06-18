import { ICliente } from "./cliente";

export interface IApikey {
  _id?: string;
  //
  identificacion?: string;
  key?: string;

  // Permisos
  global?: boolean;
  idClientes?: string[];

  // Populate
  clientes?: ICliente[];
}

type OmitirCreate = "_id" | "clientes";

export interface ICreateApikey extends Omit<Partial<IApikey>, OmitirCreate> {}

type OmitirUpdate = "_id" | "clientes";

export interface IUpdateApikey extends Omit<Partial<IApikey>, OmitirUpdate> {}
