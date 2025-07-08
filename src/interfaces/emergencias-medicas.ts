import { DireccionV2 } from "../auxiliares";
import { ICliente } from "./cliente";
import { IDestinatarioAsistencia } from "./destinatario-asistencia";
import {
  EstadoEmergencia,
  IEventoEmergenciaMedica,
} from "./evento-emergencia-medica";

export interface IArchivosAdjuntos {
  fechaSubida?: string;
  descripcion?: string;
  adjuntos?: string; //url del archivo
  usuario?: string; //usuario que subió el archivo
}

//EMERGENCIA MÉDICA
export interface IEmergenciaMedica {
  _id?: string;
  idDestinatarioAsistencia?: string;
  idCliente?: string;

  //Información básica para auxilio o para llamada de emergencia
  fechaCreacion?: string;
  estadoActual?: EstadoEmergencia; //Este estado será el del último evento asociado a la emergencia
  codigo?: number; // Código único del caso de emergencia, es incremental
  solicitante?: string; // Nombre del solicitante de la emergencia
  telefono?: string; // Teléfono de contacto del solicitante
  sintomas?: string[]; // Lista de síntomas reportados
  prioridad?: PrioridadEmergencia;
  observaciones?: string; // Notas adicionales sobre el auxilio/llamada
  archivosAdjuntos?: IArchivosAdjuntos[];

  //Información exclusiva de auxilio
  esAuxilio?: boolean;
  direccion?: DireccionV2; //Esta es la dirección que el solicitante indica para la emergencia. No tiene nada que ver con las direcciones de seguimiento de la emergencia en los eventos.
  asignada?: boolean;
  ultimaActualizacion?: string;
  ultimoEventoEmergenciaMedica?: IEventoEmergenciaMedica; //Acá se carga el último evento para hacer el seguimiento del auxilio

  //Populate
  destinatarioAsistencia?: IDestinatarioAsistencia; // Información del paciente
  cliente?: ICliente;
}

type PrioridadEmergencia = "Baja" | "Media" | "Alta" | "Crítica" | "Óbito";

type OmitirCreate = "_id";

export interface ICreateEmergenciaMedica
  extends Omit<Partial<IEmergenciaMedica>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateEmergenciaMedica
  extends Omit<Partial<IEmergenciaMedica>, OmitirUpdate> {}
