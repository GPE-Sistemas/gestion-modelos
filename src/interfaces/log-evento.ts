import { IDispositivoLorawan } from "./dispositivo-lorawan";

export interface ILogEvento {
  _id?: string;
  fechaCreacion?: string;
  deveui?: string;
  deviceName?: string;
  payload?: string;

  //Populate
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = "_id" | "fechaCreacion";

export interface ICreateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirUpdate> {}
