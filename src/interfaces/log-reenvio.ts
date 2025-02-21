import { ICliente } from "./cliente";
import { IDispositivoAlarma } from "./dispositivo-alarma";
import { ITracker } from "./tracker";

export interface ILogReenvio {
  _id?: string;
  //
  idCliente?: string;
  fecha?: string;
  idEntidad?: string;

  protocolo?: "UDP" | "TCP";
  host?: string;
  puerto?: number;
  body?: string;
  ack?: boolean;
  error?: string;

  // Populate
  cliente?: ICliente;
  dispositivoAlarma?: IDispositivoAlarma;
  tracker?: ITracker;
}

type OmitirCreate = "_id" | "cliente" | "dispositivoAlarma" | "tracker";

export interface ICreateLogReenvio
  extends Omit<Partial<ILogReenvio>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "dispositivoAlarma" | "tracker";

export interface IUpdateLogReenvio
  extends Omit<Partial<ILogReenvio>, OmitirUpdate> {}
