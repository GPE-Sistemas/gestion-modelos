import { ICliente } from './cliente';
import {
  IDispositivoLorawan,
  TipoDispositivoLorawan,
} from './dispositivo-lorawan';
import { IModeloDispositivo } from './modelo-dispositivo';

// Estado de cada job en la cola de downlinks. Se persiste en la BD para
// auditoría y para que la UI pueda mostrar progreso. Espejo (en parte) del
// estado de BullMQ + el estado del IComando emitido.

export type EstadoDownlinkJob =
  | 'En cola' // creado, esperando turno
  | 'Programado' // tiene delay y está en BullMQ (delayed)
  | 'Enviando' // worker tomó el job
  | 'Enviado' // se llamó a chirpstack.sendDownlink OK
  | 'Confirmado' // se asoció a comando con estado terminal favorable
  | 'Descartado' // device offline / NS sin sesión
  | 'Cancelado' // cancelado por superseding job
  | 'Fallido'; // error técnico tras N reintentos

// Origen permite filtrar/diferenciar reintentos, auditoría y políticas.
export type OrigenDownlinkJob =
  | 'Reconciliacion' // Viene del Cron cuando intenta ajustar la configuración del dispositivo si esta difiere de la configuración deseada
  | 'GrupoManual' // Viene de la UI cuando se envian comandos grupales
  | 'IndividualManual' // Viene de la UI cuando se envian comandos individuales
  | 'AutoGetActis'; // Es un caso particular de las luminarias ACTIS. Luego de que se ejecuta un comando del tipo set, para refeljar cambios en la configuración se requiere un comando del tipo get.

// Get encadenado tras un set ACTIS. El processor lee este campo y, tras enviar
// el set, encola un nuevo job (origen='AutoGetActis') con el delay indicado.
export interface IProximoGetDownlinkJob {
  puerto: number;
  payload: string;
  delaySegundos: number;
}

export interface IDownlinkJob {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];

  idDispositivoLorawan: string;
  deveui: string;
  tipoDispositivo?: TipoDispositivoLorawan;

  origen: OrigenDownlinkJob;
  idEjecucion?: string; // batch id (uuid) — agrupa todos los jobs de una acción
  idJobBull?: string; // BullMQ job id

  puerto: number;
  payload: string;
  nombre: string;
  descripcion?: string;

  // Idempotencia / superseding. Default '<deveui>:<puerto>' o
  // '<deveui>:<puerto>:<sha1(payload)[:8]>' si distintos payloads coexisten (Ej: perfiles de dimerizado ACTIS).
  claveDedup?: string; //Si dos downlinks tienen la misma claveDedup, el segundo cancela al primero (si no se ejecutó aún) y lo reemplaza en la cola de BullMQ. El processor siempre procesa el más reciente.
  //Ej de uso: se envía un downlink de cambio de configuración, se encola con clave, si después se envía otro downlink de cambio de configuración, con la misma clave, el primer downlink se cancela si aún no se ejecutó. Se prioriza el último

  // Estado
  estado: EstadoDownlinkJob;
  intentos: number;
  ultimoError?: string;
  idComando?: string; // se llena al crear el IComando real en BD

  // Auto-get encadenado (ACTIS)
  proximoGet?: IProximoGetDownlinkJob;

  // Datos extra que se propagan al IComando (ej: modoRele para pto 10)
  datosExtra?: Record<string, any>;

  //Fechas
  fechaCreacion?: string;
  fechaProgramada?: string; // cuando se encola en BullMQ con delay
  fechaEnviado?: string;
  fechaConfirmado?: string;

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  dispositivo?: IDispositivoLorawan;
}

type OmitirCreate =
  | '_id'
  | 'fechaCreacion'
  | 'fechaEnviado'
  | 'fechaConfirmado'
  | 'idsAncestros';
export interface ICreateDownlinkJob extends Omit<
  Partial<IDownlinkJob>,
  OmitirCreate
> {
  idDispositivoLorawan: string;
  deveui: string;
  origen: OrigenDownlinkJob;
  puerto: number;
  payload: string;
  nombre: string;
  estado: EstadoDownlinkJob;
  intentos: number;
}

type OmitirUpdate = '_id' | 'fechaCreacion' | 'idsAncestros';
export interface IUpdateDownlinkJob extends Omit<
  Partial<IDownlinkJob>,
  OmitirUpdate
> {}
