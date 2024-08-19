import { ICliente } from "./cliente";
import { IVehiculo } from "./vehiculo";
import { IDocumentacion } from "./documentacion";

export type TipoRecordatorio = ["km", "fecha"];

export interface IRecordatorio {
  _id?: string;
  idCliente?: string;
  tipo?: TipoRecordatorio;
  kmLimite?: number;
  idVehiculo?: string;
  idDocumentacion?: string;

  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
  documentacion?: IDocumentacion;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo" | "documentacion";

export interface ICreateRecordatorio
  extends Omit<Partial<IRecordatorio>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo" | "documentacion";

export interface IUpdateRecordatorio
  extends Omit<Partial<IRecordatorio>, OmitirUpdate> {}
