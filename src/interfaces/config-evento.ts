import { ICliente } from "./cliente";
import { IDispositivoAlarma } from "./dispositivo-alarma";
import { ITipoEvento } from "./tipo-evento";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export interface IConfigEvento {
  _id?: string;
  //
  nombre?: string;
  notificar?: boolean;
  atender?: boolean;
  noDerivar?: boolean;
  codigoEvento?: string;
  nombreEvento?: string;
  //
  idTipoEvento?: string;
  idTracker?: string;
  idAlarma?: string;
  idCliente?: string;
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios?: string[];
  //populate
  tracker?: ITracker;
  tipoEvento?: ITipoEvento;
  alarma?: IDispositivoAlarma;
  usuarios?: IUsuario[];
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "tipoEvento" | "alarma" | "tracker" | "cliente";

export interface ICreateConfigEvento
  extends Omit<Partial<IConfigEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "tipoEvento" | "alarma" | "tracker" | "cliente";

export interface IUpdateConfigEvento
  extends Omit<Partial<IConfigEvento>, OmitirUpdate> {}
