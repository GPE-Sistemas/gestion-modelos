import { DireccionV2 } from "../auxiliares";
import { ICliente } from "./cliente";

export interface ICentroMedico {
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

export interface ICreateCentroMedico
  extends Omit<Partial<ICentroMedico>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateCentroMedico
  extends Omit<Partial<ICentroMedico>, OmitirUpdate> {}
