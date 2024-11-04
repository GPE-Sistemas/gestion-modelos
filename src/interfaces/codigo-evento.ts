import { ICliente } from "./cliente";

export interface ICodigoEvento {
  _id?: string;
  //
  nombre?: string;
  prioridad?: number;
  idCliente?: string;
  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateCodigoEvento
  extends Omit<Partial<ICodigoEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateCodigoEvento
  extends Omit<Partial<ICodigoEvento>, OmitirUpdate> {}
