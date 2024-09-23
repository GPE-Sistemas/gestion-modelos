import { ICliente } from "./cliente";
export interface IDomicilio {
  _id?: string;
  //
  direccion?: string;
  ubicacion?: string;
  idCliente?: string;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateDomicilio
  extends Omit<Partial<IDomicilio>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateDomicilio
  extends Omit<Partial<IDomicilio>, OmitirUpdate> {}
