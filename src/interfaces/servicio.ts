import { ICoordenadas } from "../auxiliares";
import { ICliente } from "./cliente";
import { IVehiculo } from "./vehiculo";

export type TipoServicio = "Gasto" | "Mantenimiento";

export interface IServicio {
  _id?: string;
  tipo?: TipoServicio;
  idCliente?: string;
  idVehiculo?: string;
  fechaRealizacion?: string;
  fechaCreacion?: string;
  nombreChofer?: string;
  detalles?: string;
  kmDelMantenimiento?: number;
  costo?: number;
  ubicacion?: ICoordenadas;
  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo";

export interface ICreateServicio
  extends Omit<Partial<IServicio>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo";

export interface IUpdateServicio
  extends Omit<Partial<IServicio>, OmitirUpdate> {}
