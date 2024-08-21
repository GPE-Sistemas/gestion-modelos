import { ICliente } from "./cliente";
import { IRecordatorio } from "./recordatorio";
import { IUsuario } from "./usuario";

export interface INotificacion {
  _id?: string;
  idCliente?: string;
  idUsuario?: string;
  fechaCreacion?: string;
  fechaLeido?: string;
  leido?: boolean;
  archivado?: boolean;
  titulo?: string;
  mensaje?: string;

  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
}

type OmitirCreate = "_id" | "cliente" | "usuario";

export interface ICreateNotificacion
  extends Omit<Partial<INotificacion>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "usuario";

export interface IUpdateNotificacion
  extends Omit<Partial<INotificacion>, OmitirUpdate> {}
