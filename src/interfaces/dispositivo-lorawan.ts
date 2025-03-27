import { ICliente } from "./cliente";
import { IReporteDispositivo } from "./reporte-dispositivo";

export interface IConfigDispositivoLuminaria {
  // TODO: Definir los tipos de las propiedades cuando sean conocidos
  [key: string]: any;
}

export interface IDispositivoLorawan {
  _id?: string;
  idCliente?: string;
  fechaCreacion?: string;
  config?: IConfigDispositivoLuminaria;
  fechaUltimaComunicacion?: string;
  ultimoReporte?: IReporteDispositivo;

  // Datos para el lora server
  deveui?: string;
  joineui?: string;
  description?: string;
  name?: string;
  tags?: Record<string, string>;
  applicationId?: string;
  deviceProfileId?: string;
  variables?: Record<string, string>;
  isDisabled?: boolean;
  skipFcntCheck?: boolean;

  // Datos para OTAA
  appkey?: string; //Con esta se completa tanto el appKey y el nwkKey para deviceKeys

  //Datos para ABP
  devAddr?: string;
  appSKey?: string;
  fCntUp?: number;
  nFCntDown?: string;
  nwkskey?: string; //Con esta se completa fNwkSIntKey, nwkSEncKey y sNwkSIntKey para activationKeys

  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirUpdate> {}
