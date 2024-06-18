import { ICliente } from "./cliente";
import { ITracker } from "./tracker";
import { IVehiculo } from "./vehiculo";

export interface IEventoTraccar {
  _id?: string;
  //
  traccarUniqueId?: string;
  idTracker?: string;
  idVehiculo?: string;
  idCliente?: string;
  tipo?: "events" | "devices";
  //
  fechaCreacion?: string;
  data?: Record<string, any>;
  ///
  tracker?: ITracker;
  vehiculo?: IVehiculo;
  cliente?: ICliente;
}

type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "tracker"
  | "vehiculo";

export interface ICreateEventoTraccar
  extends Omit<Partial<IEventoTraccar>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "tracker"
  | "vehiculo";

export interface IUpdateEventoTraccar
  extends Omit<Partial<IEventoTraccar>, OmitirUpdate> {}
