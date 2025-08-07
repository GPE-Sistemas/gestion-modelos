import { ICliente } from "./cliente";
import { DireccionV2 } from "../auxiliares";
import { TipoEmergencia } from "./emergencias";

export interface IInfoAdicional {
  descripcion?: string;
  adjuntos?: string[]; // Array de URLs de archivos adjuntos
}

export interface IDestinatarioAsistencia {
  _id?: string; // ID único del destinatario
  idCliente?: string;
  idsAncestros?: string[];

  fechaCreacion?: string;
  nombre?: string;
  tipoEmergencia?: TipoEmergencia;
  apellido?: string;
  sexo?: "M" | "F" | "X";
  dni?: string;
  edad?: number;
  obraSocial?: string;
  infoAdicional?: IInfoAdicional; // Información adicional del destinatario
  telefono?: string; // Teléfono del destinatario
  email?: string; // Correo electrónico del destinatario
  telefonoAlternativo?: string;
  ubicacion?: DireccionV2; // Ubicación del destinatario

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = "_id";

export interface ICreateDestinatarioAsistencia
  extends Omit<Partial<IDestinatarioAsistencia>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateDestinatarioAsistencia
  extends Omit<Partial<IDestinatarioAsistencia>, OmitirUpdate> {}
