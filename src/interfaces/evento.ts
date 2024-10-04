import { ICliente } from "./cliente";
import { ITracker } from "./tracker";
import { IConfigEvento } from "./config-evento";
import { IDispositivoAlarma } from "./dispositivo-alarma";
export type estadoEvento =
  | "Sin Tratamiento"
  | "Pendiente"
  | "En Atención"
  | "En Espera"
  | "Liberada"
  | "Finalizada";
export interface IEvento {
  _id?: string;
  //
  notificar?: boolean;
  fechaCreacion?: string;
  posponerHasta?: string;
  estado?: estadoEvento;
  valores?: Record<string, any>;
  //
  idTracker?: string;
  idAlarma?: string;
  idConfigEvento?: string;
  idCliente?: string;
  idUsuarioAtendiendo?: string;
  // Populate
  alarma?: IDispositivoAlarma;
  tracker?: ITracker;
  cliente?: ICliente;
  configEvento?: IConfigEvento;
}

type OmitirCreate = "_id" | "configEvento" | "cliente" | "tracker" | "alarma";

export interface ICreateEvento extends Omit<Partial<IEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "configEvento" | "cliente" | "tracker" | "alarma";

export interface IUpdateEvento extends Omit<Partial<IEvento>, OmitirUpdate> {}
