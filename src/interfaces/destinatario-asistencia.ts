export interface IUbicaciónDestinatario {
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
  nombre?: string;
  apellido?: string;
  sexo?: "masculino" | "femenino" | "otro";
  dni?: string;
  edad?: number;
  obraSocial?: string;
  infoAdicional?: IInfoAdicional; // Información adicional del destinatario
  telefono?: string; // Teléfono del destinatario
  email?: string; // Correo electrónico del destinatario
  telefonosAlternativos?: string[]; // Array de teléfonos alternativos
  ubicacion?: IUbicaciónDestinatario; // Ubicación del destinatario
}
