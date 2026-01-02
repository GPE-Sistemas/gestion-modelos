import { RxInfo, TxInfo } from '../auxiliares';
import { IDispositivoLorawan } from './dispositivo-lorawan';

export type TipoLogEvento =
  | 'up'
  | 'status'
  | 'join'
  | 'ack'
  | 'txack'
  | 'down'
  | 'log';
export interface IMetadatosUplink {
  rxInfo?: RxInfo[];
  txInfo?: TxInfo;
  dr?: number;
  /** Tiempo en aire (Time on Air) en milisegundos */
  timeOnAir?: number;
  /** Tamaño del payload en bytes */
  payloadSize?: number;
}
export interface ILogEvento {
  _id?: string;
  fechaCreacion?: string;
  expireAt?: string;
  tipo?: TipoLogEvento;
  deveui?: string;
  deviceName?: string;
  payload?: string;
  puerto?: number;
  battery?: number;
  fCnt?: number;
  margin?: number;
  metadatosUplink?: IMetadatosUplink;

  // Campos específicos para mensajes de tipo 'log' de ChirpStack
  level?: string; // "ERROR", "WARNING", "INFO"
  code?: string; // Código del tipo de log (ej: "DOWNLINK_GATEWAY", "UPLINK_F_CNT_RETRANSMISSION")
  description?: string; // Descripción del evento
  context?: Record<string, any>; // Contexto adicional del log

  //Populate
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = '_id' | 'fechaCreacion';

export interface ICreateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'fechaCreacion' | 'cliente';

export interface IUpdateLogEvento
  extends Omit<Partial<ILogEvento>, OmitirUpdate> {}
