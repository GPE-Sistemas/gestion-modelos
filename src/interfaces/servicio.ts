import { ICoordenadas } from "../auxiliares";
import { ICliente } from "./cliente";
import { IProveedor } from "./proveedor";
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
  idProveedor?: string;
  // Populate
  cliente?: ICliente;
  proveedor?: IProveedor;
  vehiculo?: IVehiculo;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo" | "proveedor";

export interface ICreateServicio
  extends Omit<Partial<IServicio>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo" | "proveedor";

export interface IUpdateServicio
  extends Omit<Partial<IServicio>, OmitirUpdate> {}
