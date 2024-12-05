import { ICliente } from "./cliente";
import { IModeloDispositivo } from "./modelo-dispositivo";

export type TipoHabilitacion = "Siempre" | "Con Evento";

export interface ICanalesCamara {
  [numero: string]: {
    nombre?: string;
    descripcion?: string;
    tipoHabilitacion?: TipoHabilitacion;
  };
}

export interface ICamara {
  _id?: string;
  idCliente?: string;
  fechaCreacion?: string;
  identificacion?: string;
  canales?: ICanalesCamara;
  idModeloDispositivo?: string;
  host?: string;
  puerto?: number;
  usuario?: string;
  password?: string;
  // Populate
  cliente?: ICliente;
  modeloDispositivo?: IModeloDispositivo;
}

type OmitirCreate = "_id" | "cliente" | "modeloDispositivo";

export interface ICreateCamara extends Omit<Partial<ICamara>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "modeloDispositivo";

export interface IUpdateCamara extends Omit<Partial<ICamara>, OmitirUpdate> {}
