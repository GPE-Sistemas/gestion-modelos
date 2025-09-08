import { DireccionV2 } from "../auxiliares";
import { ICliente } from "./cliente";
import { IUbicacion } from "./ubicacion";

export interface IHospital {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];

  fechaCreacion?: string;
  nombre?: string; // Nombre del hospital
  idUbicacion?: string;
  telefono?: string; // Teléfono de contacto
  email?: string; // Email institucional
  tipo?: "Público" | "Privado" | "Público-privado"; // Tipo de gestión
  activo?: boolean; // Si está operativo

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  ubicacion?: IUbicacion;
}

type OmitirCreate = "_id";

export interface ICreateHospital
  extends Omit<Partial<IHospital>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateHospital
  extends Omit<Partial<IHospital>, OmitirUpdate> {}
