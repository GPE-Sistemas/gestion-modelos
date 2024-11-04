import { ICliente } from "./cliente";
import { ICodigoEvento } from "./codigo-evento";

export interface ITipoEvento {
  _id?: string;
  //
  nombre?: string;
  color?: string;
  notificar?: boolean;
  atender?: boolean;
  noDerivar?: boolean;
  idCliente?: string;
  idCodigoEvento?: string;
  //Populate
  cliente?: ICliente;
  codigoEvento?: ICodigoEvento;
}

type OmitirCreate = "_id" | "cliente" | "codigoEvento";

export interface ICreateTipoEvento
  extends Omit<Partial<ITipoEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "codigoEvento";

export interface IUpdateTipoEvento
  extends Omit<Partial<ITipoEvento>, OmitirUpdate> {}
