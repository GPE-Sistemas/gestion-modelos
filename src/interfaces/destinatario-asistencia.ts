import { ICliente } from "./cliente";

export interface IUbicacionDestinatario {
  calle?: string;
  entreCalles?: string;
  numero: string;
  piso?: string;
  depto?: string;
  localidad: string;
}

export interface IInfoAdicional {
  descripcion?: string;
  adjuntos?: string[]; // Array de URLs de archivos adjuntos
}

export interface IDestinatarioAsistencia {
  _id?: string; // ID único del destinatario
  idCliente?: string;
  nombre?: string;
  apellido?: string;
  sexo?: "M" | "F" | "X";
  dni?: string;
  edad?: number;
  obraSocial?: string;
  infoAdicional?: IInfoAdicional; // Información adicional del destinatario
  telefono?: string; // Teléfono del destinatario
  email?: string; // Correo electrónico del destinatario
  telefonosAlternativos?: string[]; // Array de teléfonos alternativos
  ubicacion?: IUbicacionDestinatario; // Ubicación del destinatario

  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id";

export interface ICreateDestinatarioAsistencia
  extends Omit<Partial<IDestinatarioAsistencia>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateDestinatarioAsistencia
  extends Omit<Partial<IDestinatarioAsistencia>, OmitirUpdate> {}
