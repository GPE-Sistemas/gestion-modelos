import { IDispositivoLorawan } from "./dispositivo-lorawan";

export type TipoLogEvento = "up" | "status" | "join" | "ack" | "txack";
export interface ILogEvento {
  _id?: string;
  fechaCreacion?: string;
  tipo?: TipoLogEvento;
  deveui?: string;
  deviceName?: string;
  payload?: string;
  puerto?: number;
  battery?: number;
  fCnt?: number;

  //Populate
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = "_id" | "fechaCreacion";

export interface ICreateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirUpdate> {}
