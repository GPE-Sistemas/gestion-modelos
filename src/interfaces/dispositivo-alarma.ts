import { ICliente } from "./cliente";
import { IDomicilio } from "./domicilio";
import { IModeloAlarma } from "./modelo-alarma";
export interface IDispositivoAlarma {
  _id?: string;
  //
  idModelo?: string;
  idDomicilio?: string;
  idCliente?: string;
  // Populate
  domicilio?: IDomicilio;
  modelo?: IModeloAlarma;
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente" | "modelo" | "domicilio";

export interface ICreateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "modelo" | "domicilio";

export interface IUpdateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirUpdate> {}