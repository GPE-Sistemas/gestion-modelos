import { ICliente } from "./cliente";
import { IDestinatarioAsistencia } from "./destinatario-asistencia";

type EstadoEmergencia = "Pendiente" | "En Camino" | "Atendida" | "Cancelada";

type PrioridadEmergencia = "Baja" | "Media" | "Alta" | "Crítica";

export interface IUbicacionEmergencia {
  calle?: string;
  entreCalles?: string;
  numero?: string;
  piso?: string;
  depto?: string;
  localidad?: string;
}

export interface IEmergenciaMedica {
  _id?: string;
  idDestinatarioAsistencia?: string; // ID del destinatario de la asistencia
  idCliente?: string;

  //Información básica
  fechaCreacion?: string;
  ultimaActualizacion?: string;
  codigo?: string; // Código único del caso de emergencia
  solicitante?: string; // Nombre del solicitante de la emergencia
  telefono?: string; // Teléfono de contacto del solicitante
  sintomas?: string[]; // Lista de síntomas reportados
  estado?: EstadoEmergencia;
  prioridad?: PrioridadEmergencia;
  observaciones?: string; // Notas adicionales sobre el caso

  //Ubicación de la emergencia
  ubicacion?: IUbicacionEmergencia;

  //Personal asociado
  movil?: string; // Identificador del móvil asignado
  medico?: string; // Médico asignado
  enfermero?: string; // Enfermero asignado
  chofer?: string; // Chofer del móvil

  //Populate
  destinatarioAsistencia?: IDestinatarioAsistencia; // Información del destinatario de la asistencia
  cliente?: ICliente;
}

type OmitirCreate = "_id";

export interface ICreateEmergenciaMedica
  extends Omit<Partial<IEmergenciaMedica>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateEmergenciaMedica
  extends Omit<Partial<IEmergenciaMedica>, OmitirUpdate> {}
