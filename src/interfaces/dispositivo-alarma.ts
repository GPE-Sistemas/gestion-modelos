import { ICliente } from "./cliente";
import { IModeloDispositivo } from "./modelo-dispositivo";
import { IUbicacion } from "./ubicacion";

export type Operador = "Personal" | "Claro" | "Movistar" | "Tuenti" | "Otro";
export interface IDispositivoAlarma {
  _id?: string;
  //
  idComunicador?: string;
  idModelo?: string;
  idDomicilio?: string;
  idCliente?: string;
  nombre?: string;
  numeroAbonado?: string;
  sim1?: {
    iccid: string;
    numero: string;
    operador: Operador;
  };
  sim2?: {
    iccid: string;
    numero: string;
    operador: Operador;
  };
  idsClientesQuePuedenAtender?: string[];
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
