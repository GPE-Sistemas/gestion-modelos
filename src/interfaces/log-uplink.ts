import { IDispositivoLorawan } from "./dispositivo-lorawan";

export interface ILogUplink {
  _id?: string;
  fechaCreacion?: string;
  deveui?: string;
  deviceName?: string;
  payload?: string;

  //Populate
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = "_id" | "fechaCreacion";

export interface ICreateLogUplink
  extends Omit<Partial<ILogUplink>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateLogUplink
  extends Omit<Partial<ILogUplink>, OmitirUpdate> {}
