import { ICliente } from "./cliente";
import { IRecordatorio } from "./recordatorio";

export interface INotificacion {
  _id?: string;
  idCliente?: string;
  archivado: boolean;
  idRecordatorio?: string;

  // Populate
  cliente?: ICliente;
  recordatorio?: IRecordatorio;
}

type OmitirCreate = "_id" | "cliente" | "recordatorio";

export interface ICreateNotificacion
  extends Omit<Partial<INotificacion>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "recordatorio";

export interface IUpdateNotificacion
  extends Omit<Partial<INotificacion>, OmitirUpdate> {}
