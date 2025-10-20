import { ICliente } from "./cliente";
import { IDispositivoAlarma } from "./dispositivo-alarma";
import { ITracker } from "./tracker";

export type MetodoReenvio = "Básico" | "Seguridad Evento Externo";

export type IAgrupacionReenvio =
  | "Todos los trackers del cliente"
  | "Todas las alarmas del cliente"
  | "Entidad";
export interface IOpcionesReenvio {
  metodo?: MetodoReenvio;
  host?: string;
  puerto?: number;
  apikey?: string;
}

export interface IConfigReenvio {
  _id?: string;
  activo?: boolean;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  // Configuracion
  agrupacionReenvio?: IAgrupacionReenvio;
  idClienteReenvio?: string;
  idEntidadReenvio?: string;
  opcionesReenvio?: IOpcionesReenvio;
  reenviarHijos?: boolean; /// solo para trackers o alarmas de clientes hijos del cliente reenvio -- tambien se reenvian los propios

  // Virtual
  cliente?: ICliente;
  ancestros?: ICliente[];
  clienteReenvio?: ICliente;
  dispositivoAlarma?: IDispositivoAlarma;
  tracker?: ITracker;
}

type OmitirCreate = "_id" | "cliente" | "dispositivoAlarma" | "tracker";
export interface ICreateConfigReenvio
  extends Omit<Partial<IConfigReenvio>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "dispositivoAlarma" | "tracker";
export interface IUpdateConfigReenvio
  extends Omit<Partial<IConfigReenvio>, OmitirUpdate> {}
