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
  appkey?: string;
  description?: string;
  name?: string;
  tags?: Record<string, string>;
  applicationId?: string;
  genAppKey?: string;
  nwkKey?: string;
  deviceProfileId?: string;
  variables?: Record<string, string>;
  isDisabled?: boolean;
  skipFcntCheck?: boolean;

  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirUpdate> {}
