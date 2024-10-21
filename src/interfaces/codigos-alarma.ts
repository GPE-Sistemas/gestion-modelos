import { ICliente } from "./cliente";

export type codigoAlarma = {
  codigo: string;
  descripcion: string;
};
export interface ICodigosAlarma {
  _id?: string;
  //
  nombre?: string;
  eventos?: codigoAlarma[];
  idCliente?: string;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateCodigosAlarma
  extends Omit<Partial<ICodigosAlarma>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateCodigosAlarma
  extends Omit<Partial<ICodigosAlarma>, OmitirUpdate> {}
