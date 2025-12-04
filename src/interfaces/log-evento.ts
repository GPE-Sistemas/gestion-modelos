import { RxInfo, TxInfo } from '../auxiliares';
import { IDispositivoLorawan } from './dispositivo-lorawan';

export type TipoLogEvento = 'up' | 'status' | 'join' | 'ack' | 'txack' | 'down';
export interface IMetadatosUplink {
  rxInfo?: RxInfo[];
  txInfo?: TxInfo;
  dr?: number;
}
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
  margin?: number;
  metadatosUplink?: IMetadatosUplink;

  //Populate
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = '_id' | 'fechaCreacion';

export interface ICreateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'fechaCreacion' | 'cliente';

export interface IUpdateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirUpdate> {}
