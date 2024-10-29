import { ICliente } from "./cliente";
import { IModeloDispositivo } from "./modelo-dispositivo";
import { IUbicacion } from "./ubicacion";
export interface IDispositivoAlarma {
  _id?: string;
  //
  idComunicador?: string;
  idModelo?: string;
  idDomicilio?: string;
  idCliente?: string;
  nombre?: string;
  // Populate
  domicilio?: IUbicacion;
  modelo?: IModeloDispositivo;
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente" | "modelo" | "domicilio";

export interface ICreateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "modelo" | "domicilio";

export interface IUpdateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirUpdate> {}
