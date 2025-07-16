import { DireccionV2 } from "../auxiliares";
import { ICliente } from "./cliente";

export interface ICentroDeAtencion {
  _id?: string;
  idCliente?: string;

  fechaCreacion?: string;
  nombre?: string;
  direccion?: DireccionV2;
  telefono?: string; // Teléfono de contacto
  email?: string; // Email institucional
  activo?: boolean; // Si está operativo

  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id";

export interface ICreateCentroDeAtencion
  extends Omit<Partial<ICentroDeAtencion>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateCentroDeAtencion
  extends Omit<Partial<ICentroDeAtencion>, OmitirUpdate> {}
