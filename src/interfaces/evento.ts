import { ICliente } from "./cliente";
import { ITracker } from "./tracker";
import { IDispositivoAlarma } from "./dispositivo-alarma";
import { IReporte } from "./reporte";
import { IActivo } from "./activo";
export type estadoEvento =
  | "Sin Tratamiento"
  | "Pendiente"
  | "En Atención"
  | "En Espera"
  | "Liberada"
  | "Finalizada";

export interface IValoresEvento {
  titulo?: string;
  mensaje?: string;
  color?: string;
  [key: string]: any;
}

export interface IEvento {
  _id?: string;
  //
  notificar?: boolean;
  atender?: boolean;
  fechaCreacion?: string;
  posponerHasta?: string;
  estado?: estadoEvento;
  valores?: IValoresEvento;
  //
  idTracker?: string;
  idAlarma?: string;
  idCliente?: string;
  idUsuarioAtendiendo?: string;
  idReporte?: string;
  idActivo?: string;
  // Populate
  alarma?: IDispositivoAlarma;
  tracker?: ITracker;
  cliente?: ICliente;
  reporte?: IReporte;
  activo?: IActivo;
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "tracker"
  | "alarma"
  | "reporte"
  | "activo";

export interface ICreateEvento extends Omit<Partial<IEvento>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "tracker"
  | "alarma"
  | "reporte"
  | "activo";

export interface IUpdateEvento extends Omit<Partial<IEvento>, OmitirUpdate> {}
