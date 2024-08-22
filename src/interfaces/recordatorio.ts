import { ICliente } from "./cliente";
import { IVehiculo } from "./vehiculo";
import { IDocumentacion } from "./documentacion";
import { IUsuario } from "./usuario";

export type TipoRecordatorio = "km" | "fecha";

export interface IRecordatorio {
  _id?: string;
  idCliente?: string;
  idUsuario?: string;
  tipo?: TipoRecordatorio;
  fechaLimite?: string;
  fechaCreacion?: string;
  kmLimite?: number;
  idVehiculo?: string;
  idDocumentacion?: string;
  detallesDelManteniemiento?: string;

  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
  vehiculo?: IVehiculo;
  documentacion?: IDocumentacion;
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "vehiculo"
  | "documentacion"
  | "usuario";

export interface ICreateRecordatorio
  extends Omit<Partial<IRecordatorio>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "vehiculo"
  | "documentacion"
  | "usuario";

export interface IUpdateRecordatorio
  extends Omit<Partial<IRecordatorio>, OmitirUpdate> {}
