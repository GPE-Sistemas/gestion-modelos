import { DireccionV2 } from "../auxiliares";
import { ICliente } from "./cliente";
import { IDestinatarioAsistencia } from "./destinatario-asistencia";
import {
  EstadoEmergencia,
  IEventoEmergenciaMedica,
} from "./evento-emergencia-medica";

//EMERGENCIA MÉDICA
export interface IEmergenciaMedica {
  _id?: string;
  idDestinatarioAsistencia?: string;
  idCliente?: string;

  //Información básica
  fechaCreacion?: string;
  estadoActual?: EstadoEmergencia; //Este estado será el del último evento asociado a la emergencia
  ultimaActualizacion?: string;
  codigo?: number; // Código único del caso de emergencia, es incremental
  solicitante?: string; // Nombre del solicitante de la emergencia
  telefono?: string; // Teléfono de contacto del solicitante
  sintomas?: string[]; // Lista de síntomas reportados
  prioridad?: PrioridadEmergencia;
  observaciones?: string; // Notas adicionales sobre el caso
  direccion?: DireccionV2; //Esta es la dirección que el solicitante indica para la emergencia. No tiene nada que ver con las direcciones de seguimiento de la emergencia en los eventos.
  asignada?: boolean;
  ultimoEventoEmergenciaMedica?: IEventoEmergenciaMedica; //Acá se carga el último evento para hacer el seguimiento

  //Populate
  destinatarioAsistencia?: IDestinatarioAsistencia; // Información del paciente
  cliente?: ICliente;
}

type PrioridadEmergencia = "Baja" | "Media" | "Alta" | "Crítica";

type OmitirCreate = "_id";

export interface ICreateEmergenciaMedica
  extends Omit<Partial<IEmergenciaMedica>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateEmergenciaMedica
  extends Omit<Partial<IEmergenciaMedica>, OmitirUpdate> {}
