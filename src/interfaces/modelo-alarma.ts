import { ICliente } from "./cliente";
import { ICodigosAlarma } from "./codigos-alarma";

export interface IModeloAlarma {
  _id?: string;
  //
  marca?: string;
  modelo?: string;
  idCodigos?: string;
  idCliente?: string;
  // Populate
  cliente?: ICliente;
  codigos?: ICodigosAlarma;
}

type OmitirCreate = "_id" | "codigos" | "cliente";

export interface ICreateModeloAlarma
  extends Omit<Partial<IModeloAlarma>, OmitirCreate> {}

type OmitirUpdate = "_id" | "codigos" | "cliente";

export interface IUpdateModeloAlarma
  extends Omit<Partial<IModeloAlarma>, OmitirUpdate> {}
