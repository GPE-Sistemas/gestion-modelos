import { DireccionV2 } from "../auxiliares";

export interface IHospital {
  _id?: string;
  nombre?: string; // Nombre del hospital
  direccion?: DireccionV2; //Es autoexplicativo no?
  telefono?: string; // Teléfono de contacto
  email?: string; // Email institucional
  tipo?: "publico" | "privado" | "publico-privado"; // Tipo de gestión
  activo?: boolean; // Si está operativo
}

type OmitirCreate = "_id";

export interface ICreateHospital
  extends Omit<Partial<IHospital>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateHospital
  extends Omit<Partial<IHospital>, OmitirUpdate> {}
