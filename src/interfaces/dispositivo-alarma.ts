import { ICliente } from "./cliente";
import { IModeloAlarma } from "./modelo-alarma";
import { IUbicacion } from "./ubicacion";
export interface IDispositivoAlarma {
  _id?: string;
  //
  idModelo?: string;
  idDomicilio?: string;
  idCliente?: string;
  nombre?: string;
  // Populate
  domicilio?: IUbicacion;
  modelo?: IModeloAlarma;
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente" | "modelo" | "domicilio";

export interface ICreateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "modelo" | "domicilio";

export interface IUpdateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirUpdate> {}
