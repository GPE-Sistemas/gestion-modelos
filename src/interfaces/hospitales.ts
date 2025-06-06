import { DireccionV2 } from "../auxiliares";
import { ICliente } from "./cliente";

export interface IHospital {
  _id?: string;
  idCliente?: string;

  fechaCreacion?: string;
  nombre?: string; // Nombre del hospital
  direccion?: DireccionV2; //Es autoexplicativo no?
  telefono?: string; // Teléfono de contacto
  email?: string; // Email institucional
  tipo?: "Público" | "Privado" | "Público-privado"; // Tipo de gestión
  activo?: boolean; // Si está operativo

  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id";

export interface ICreateHospital
  extends Omit<Partial<IHospital>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateHospital
  extends Omit<Partial<IHospital>, OmitirUpdate> {}
