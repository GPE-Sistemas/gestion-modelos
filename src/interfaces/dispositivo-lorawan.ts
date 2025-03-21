import { ICliente } from "./cliente";

export interface IDispositivoLorawan {
  _id?: string;
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
  idCliente?: string;
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
