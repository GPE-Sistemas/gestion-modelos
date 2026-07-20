import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ObjetivoComandoSchema } from './comando';
import {
  DispositivoLorawanSchema,
  TipoDispositivoLorawanSchema,
} from './dispositivo-lorawan';

// Estado de cada job en la cola de downlinks. Se persiste en la BD para
// auditoría y para que la UI pueda mostrar progreso. Espejo (en parte) del
// estado de BullMQ + el estado del IComando emitido.

export const EstadoDownlinkJobSchema = z.enum([
  'En cola', // creado, esperando turno
  'Programado', // tiene delay y está en BullMQ (delayed)
  'Enviando', // worker tomó el job
  'Enviado', // se llamó a chirpstack.sendDownlink OK
  'Confirmado', // se asoció a comando con estado terminal favorable
  'Descartado', // device offline / NS sin sesión
  'Cancelado', // cancelado por superseding job
  'Fallido', // error técnico tras N reintentos
]);
export type EstadoDownlinkJob = z.infer<typeof EstadoDownlinkJobSchema>;

// Origen = eje de POLÍTICA (cómo se trata el downlink). Lo leen el processor (expiresAt) y el cron de reintento. Los orígenes actuales son (Manual, Reconciliacion y AutoGet).
// La PROCEDENCIA (de qué nivel/entidad nació) vive en `objetivo` (ver IObjetivoComando).
export const OrigenDownlinkJobSchema = z.enum([
  'Reconciliacion', // Viene del Cron cuando intenta ajustar la configuración del dispositivo si esta difiere de la configuración deseada
  'Manual', // Viene de la UI: cualquier acción de usuario (individual, grupo, puesta o grupos de puestas)
  'AutoGet', // Get encadenado tras un SET que no autoreporta su cambio. Refresca dispositivo.config para cerrar el lazo del reconciliador.
  'ConsultaConfig', // Viene del Cron de consulta de configuración inicial: GETs puros para hacer el bootstrap de dispositivo.config en luminarias que nunca tuvieron perfil ni SET manual (config vacía). No escribe IConfigDeseada ni se reintenta.
]);
export type OrigenDownlinkJob = z.infer<typeof OrigenDownlinkJobSchema>;

// Una entrada por intento de TRANSPORTE (reintento BullMQ del MISMO job). Es
// append-only: el processor la agrega en cada outcome (Enviado/Descartado/Error)
// vía $push, para que la UI muestre qué se intentó y cuándo, no solo el contador.
// Los reintentos del RECONCILIADOR son jobs distintos → nodos propios, no entran acá.
export const IntentoDownlinkSchema = z.object({
  numero: z.number(), // 1..N (attemptsMade + 1)
  fecha: z.string(), // ISO del intento
  resultado: z.enum(['Enviado', 'Descartado', 'Error']),
  error: z.string().optional(), // mensaje si falló o motivo de descarte
  idComando: z.string().optional(), // IComando creado en este intento (si hubo)
});
export type IIntentoDownlink = z.infer<typeof IntentoDownlinkSchema>;

// Get encadenado tras un SET que no autoreporta su cambio. El processor lee este
// campo y, tras enviar el set, encola un nuevo job (origen='AutoGet') con el
// delay indicado.
export const ProximoGetDownlinkJobSchema = z.object({
  puerto: z.number(),
  payload: z.string(),
  delaySegundos: z.number(),
});
export type IProximoGetDownlinkJob = z.infer<
  typeof ProximoGetDownlinkJobSchema
>;

export const DownlinkJobSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),

  idDispositivoLorawan: z.string(),
  deveui: z.string(),
  tipoDispositivo: TipoDispositivoLorawanSchema.optional(),

  origen: OrigenDownlinkJobSchema,
  objetivo: ObjetivoComandoSchema.optional(), // Procedencia: desde qué nivel/entidad se originó (se propaga al IComando)
  idEjecucion: z.string().optional(), // batch id (uuid) — agrupa todos los jobs de una acción
  idJobBull: z.string().optional(), // BullMQ job id
  indicePaso: z.number().optional(), //posición de este downlink dentro del plan ordenado del dispositivo

  puerto: z.number(),
  payload: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),

  // Idempotencia / superseding. Default '<deveui>:<puerto>' o
  // '<deveui>:<puerto>:<sha1(payload)[:8]>' si distintos payloads coexisten (Ej: perfiles de dimerizado ACTIS).
  claveDedup: z.string().optional(), //Si dos downlinks tienen la misma claveDedup, el segundo cancela al primero (si no se ejecutó aún) y lo reemplaza en la cola de BullMQ. El processor siempre procesa el más reciente.
  //Ej de uso: se envía un downlink de cambio de configuración, se encola con clave, si después se envía otro downlink de cambio de configuración, con la misma clave, el primer downlink se cancela si aún no se ejecutó. Se prioriza el último

  // Estado
  estado: EstadoDownlinkJobSchema,
  intentos: z.number(),
  ultimoError: z.string().optional(),
  intentosLog: z.array(IntentoDownlinkSchema).optional(), // historial append-only por intento de transporte
  idComando: z.string().optional(), // se llena al crear el IComando real en BD

  // Auto-get encadenado (ACTIS)
  proximoGet: ProximoGetDownlinkJobSchema.optional(),

  datosExtra: z.record(z.string(), z.any()).optional(),

  //Fechas
  fechaCreacion: z.string().optional(),
  fechaProgramada: z.string().optional(), // cuando se encola en BullMQ con delay
  fechaEnviado: z.string().optional(),
  fechaConfirmado: z.string().optional(),

  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  dispositivo: DispositivoLorawanSchema.optional(),
});
export type IDownlinkJob = z.infer<typeof DownlinkJobSchema>;

// El original era Omit<Partial<IDownlinkJob>, OmitirCreate> re-declarando como
// requeridos exactamente los mismos 8 campos que ya son requeridos en la base
// (idDispositivoLorawan, deveui, origen, puerto, payload, nombre, estado,
// intentos) → equivale a un omit directo sin partial.
export const CreateDownlinkJobSchema = DownlinkJobSchema.omit({
  _id: true,
  fechaCreacion: true,
  fechaEnviado: true,
  fechaConfirmado: true,
  idsAncestros: true,
});
export type ICreateDownlinkJob = z.infer<typeof CreateDownlinkJobSchema>;

// El original era Omit<Partial<IDownlinkJob>, OmitirUpdate>: acá el Partial NO
// era no-op (la base tiene campos requeridos), por eso se agrega .partial().
export const UpdateDownlinkJobSchema = DownlinkJobSchema.omit({
  _id: true,
  fechaCreacion: true,
  idsAncestros: true,
}).partial();
export type IUpdateDownlinkJob = z.infer<typeof UpdateDownlinkJobSchema>;
