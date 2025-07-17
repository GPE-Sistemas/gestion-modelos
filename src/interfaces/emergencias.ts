import { DireccionV2 } from "../auxiliares";
import { ICentroDeAtencion } from "./centro-de-atencion";
import { ICliente } from "./cliente";
import { IDestinatarioAsistencia } from "./destinatario-asistencia";
import { IEventoEmergencia } from "./evento-emergencia";

//EMERGENCIA MÉDICA
export interface IEmergencia {
  //1-Datos de Emergencia General
  _id?: string;
  idDestinatarioAsistencia?: string;
  idCliente?: string;
  tipo?: TipoEmergencia;
  prioridad?: PrioridadEmergencia;
  fechaCreacion?: string;
  codigo?: number; // Código único del caso de emergencia médica es incremental
  solicitante?: string; // Nombre del solicitante de la emergencia
  telefono?: string; // Teléfono de contacto del solicitante
  centroDeAtencion?: ICentroDeAtencion;
  archivosAdjuntos?: IArchivosAdjuntos[];
  observaciones?: string; // Notas adicionales sobre el auxilio/llamada
  esAuxilio?: boolean; //Esto es para indicar si la emergencia requiere un seguimiento extra, es decir, se hace algo más que sólo registrarla
  direccion?: DireccionV2; //Esta es la dirección que el solicitante indica para la emergencia. No tiene nada que ver con las direcciones que puede haber en los seguimientos
  asignada?: boolean; //Indica si a la emergencia se le asignó alguna clase de personal para el seguimiento (vehículos, médicos, choferes, etc)
  ultimaActualizacion?: string;
  ultimoEventoEmergencia?: IEventoEmergencia; //Acá se carga el último evento para hacer el seguimiento del auxilio
  salioDelCentro?: boolean; //En caso de que sea un auxilio, se indica cuando el móvil asignado (ambulancia, camión de bomberos, etc) salió del centro de atención.

  //2-Datos específicos según el tipo de emergencia
  emergenciaMedica: IEmergenciaMedica;
  emergenciaBomberos: IEmergenciaBomberos;

  //Populate
  destinatarioAsistencia?: IDestinatarioAsistencia; // Información del paciente
  cliente?: ICliente;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type PrioridadEmergencia =
  | "Baja"
  | "Media"
  | "Alta"
  | "Crítica"
  | "Óbito"; //Óbito es exclusiva de emergencia médica

export type TipoEmergencia = "Médica" | "Bombero";

export interface IArchivosAdjuntos {
  fechaSubida?: string;
  descripcion?: string;
  archivo?: string; //url del archivo
  usuario?: string; //usuario que subió el archivo
  nombreOriginal?: string; //El nombre del archivo que se subió
}

export interface IEmergenciaMedica {
  sintomas?: string[]; // Lista de síntomas reportados
  diagnostico?: string; // Diagnóstico hecho
  irAHospital?: boolean; //Esto se marca una vez que la ambulancia haya llegado a la dirección de auxilio y se dé el ok para ir al hospital (se indica manualmente)
}

export interface IEmergenciaBomberos {
  //Por ahora no hay propiedades específicas de emergenciaBomberos
}

type OmitirCreate = "_id";

export interface ICreateEmergencia
  extends Omit<Partial<IEmergencia>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateEmergencia
  extends Omit<Partial<IEmergencia>, OmitirUpdate> {}
