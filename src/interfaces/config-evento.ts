import { ICliente } from "./cliente";
import { ICategoriaEvento } from "./categoria-evento";
import { IDispositivoAlarma } from "./dispositivo-alarma";
import { ITipoEvento } from "./tipo-evento";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export interface IConfigZona {
  particion?: number;
  zona?: number;
}

export interface IConfigEvento {
  _id?: string;
  //
  notificar?: boolean;
  atender?: boolean;
  noDerivar?: boolean;
  codigoReportado?: string;
  //
  idTipoEvento?: string;
  idCategoriaEvento?: string;
  idTracker?: string;
  idAlarma?: string;
  idCliente?: string;
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios?: string[];
  // Los clientes que pueden atender el evento
  idsClientesQuePuedenAtender?: string[];
  configZona?: IConfigZona;
  //populate
  tracker?: ITracker;
  tipoEvento?: ITipoEvento;
  categoriaEvento?: ICategoriaEvento;
  alarma?: IDispositivoAlarma;
  usuarios?: IUsuario[];
  cliente?: ICliente;
  clientesQuePuedenAtender?: ICliente[];
}

type OmitirCreate =
  | "_id"
  | "tracker"
  | "tipoEvento"
  | "categoriaEvento"
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
  | "categoriaEvento"
  | "alarma"
  | "usuarios"
  | "cliente"
  | "clientesQuePuedenAtender";

export interface IUpdateConfigEvento
  extends Omit<Partial<IConfigEvento>, OmitirUpdate> {}
