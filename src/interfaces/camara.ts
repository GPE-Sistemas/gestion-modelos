import { IModeloDispositivo } from "./modelo-dispositivo";

export type TipoHabilitacion = "Siempre" | "Con Evento";

export interface ICanalesCamara {
  [numero: string]: {
    nombre: string;
    descripcion: string;
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
  modeloDispositivo?: IModeloDispositivo;
}

type OmitirCreate = "_id" | "modeloDispositivo";

export interface ICreateCamara extends Omit<Partial<ICamara>, OmitirCreate> {}

type OmitirUpdate = "_id" | "modeloDispositivo";

export interface IUpdateCamara extends Omit<Partial<ICamara>, OmitirUpdate> {}
