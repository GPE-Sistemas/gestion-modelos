import { ICliente } from "./cliente";

export interface ITipoEvento {
  _id?: string;
  //
  nombre?: string;
  color?: string;
  notificar?: boolean;
  atender?: boolean;
  idCliente?: string;
  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateTipoEvento
  extends Omit<Partial<ITipoEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateTipoEvento
  extends Omit<Partial<ITipoEvento>, OmitirUpdate> {}
