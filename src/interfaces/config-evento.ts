import { ICliente } from "./cliente";
import { ICodigoEvento } from "./codigo-evento";
import { IDispositivoAlarma } from "./dispositivo-alarma";
import { ITipoEvento } from "./tipo-evento";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export interface IConfigEvento {
  _id?: string;
  //
  notificar?: boolean;
  atender?: boolean;
  noDerivar?: boolean;
  codigoReportado?: string;
  nombreEvento?: string;
  //
  idTipoEvento?: string;
  idCodigoEvento?: string;
  idTracker?: string;
  idAlarma?: string;
  idCliente?: string;
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios?: string[];
  // Los clientes que pueden atender el evento
  idsClientesQuePuedenAtender?: string[];
  //populate
  tracker?: ITracker;
  tipoEvento?: ITipoEvento;
  codigoEvento?: ICodigoEvento;
  alarma?: IDispositivoAlarma;
  usuarios?: IUsuario[];
  cliente?: ICliente;
  clientesQuePuedenAtender?: ICliente[];
}

type OmitirCreate =
  | "_id"
  | "tracker"
  | "tipoEvento"
  | "codigoEvento"
  | "alarma"
  | "usuarios"
  | "cliente"
  | "clientesQuePuedenAtender";

export interface ICreateConfigEvento
  extends Omit<Partial<IConfigEvento>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "tracker"
  | "tipoEvento"
  | "codigoEvento"
  | "alarma"
  | "usuarios"
  | "cliente"
  | "clientesQuePuedenAtender";

export interface IUpdateConfigEvento
  extends Omit<Partial<IConfigEvento>, OmitirUpdate> {}
