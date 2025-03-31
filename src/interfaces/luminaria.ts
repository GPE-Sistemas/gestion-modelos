import { IGeoJSONPoint } from "../auxiliares";
import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";
import { IModeloDispositivo } from "./modelo-dispositivo";

export interface ILuminaria {
  _id?: string;
  fechaCreacion?: string; // Default: Date.now
  idCliente?: string;
  deveui?: string; // Deveui del dispositivo lorawan
  identificacion?: string;
  ubicacion?: IGeoJSONPoint; // GeoJSON de la ubicacion de la luminaria
  direccion?: string; // Direccion de la luminaria
  idModeloDispositivo?: string; // ID del modelo de dispositivo
  // Virtuals
  cliente?: ICliente;
  dispositivo?: IDispositivoLorawan;
  modeloDispositivo?: IModeloDispositivo;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "dispositivo"
  | "modeloDispositivo";
export interface ICreateLuminaria
  extends Omit<Partial<ILuminaria>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "dispositivo"
  | "modeloDispositivo";
export interface IUpdateLuminaria
  extends Omit<Partial<ILuminaria>, OmitirUpdate> {}
