import { ICliente } from "./cliente";

export interface IServicioContratado {
  _id?: string;
  idCliente?: string;
  nombre?: string;
  icono?: string;
  costo?: number;
  global?: boolean;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateServicioContratado
  extends Omit<Partial<IServicioContratado>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateServicioContratado
  extends Omit<Partial<IServicioContratado>, OmitirUpdate> {}
