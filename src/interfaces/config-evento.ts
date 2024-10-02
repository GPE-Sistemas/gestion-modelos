import { IDispositivoAlarma } from "./dispositivo-alarma";
import { ITipoEvento } from "./tipo-evento";
import { ITracker } from "./tracker";

export interface IConfigEvento {
  _id?: string;
  //
  nombre?: string;
  notificar?: boolean;
  codigoEvento?: string;
  nombreEvento?: string;
  //
  idTipoEvento?: string;
  idTracker?: string;
  idAlarma?: string;
  //populate
  tracker?: ITracker;
  tipoEvento?: ITipoEvento;
  alarma?: IDispositivoAlarma;
}

type OmitirCreate = "_id" | "tipoEvento" | "alarma" | "tracker";

export interface ICreateConfigEvento
  extends Omit<Partial<IConfigEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "tipoEvento" | "alarma" | "tracker";

export interface IUpdateConfigEvento
  extends Omit<Partial<IConfigEvento>, OmitirUpdate> {}
