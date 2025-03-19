import { ICliente } from "./cliente";

export interface IDispositivoLorawan {
  _id?: string;
  deveui?: string;
  appeui?: string;
  appkey?: string;
  description?: string;
  name?: string;
  tags?: Record<string, string>;
  applicationId?: string;
  genAppKey?: string;
  nwkKey?: string;
  deviceProfileId?: string;
  idCliente?: string;

  //Populate
  cliente?: ICliente;
}

export interface IDeviceProfile {
  createdAt?: string;
  id?: string;
  macVersion?: string;
  name: string;
  regParamsRevision?: string;
  region?: string;
  supportsClassB?: boolean;
  supportsClassC?: boolean;
  supportsOtaa?: boolean;
  updatedAt?: string;
  vendorID?: string;
  activationMethod?: "OTAA" | "ABP";
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirUpdate> {}
