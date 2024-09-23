import { ICodigosAlarma } from "./codigos-alarma";

export interface IModeloAlarma {
  _id?: string;
  //
  marca?: string;
  modelo?: string;
  idCodigos?: string;
  // Populate
  codigos?: ICodigosAlarma;
}

type OmitirCreate = "_id" | "codigos";

export interface ICreateModeloAlarma
  extends Omit<Partial<IModeloAlarma>, OmitirCreate> {}

type OmitirUpdate = "_id" | "codigos";

export interface IUpdateModeloAlarma
  extends Omit<Partial<IModeloAlarma>, OmitirUpdate> {}
