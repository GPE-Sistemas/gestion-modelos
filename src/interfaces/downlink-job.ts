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
// reescribiendo el array completo (no con $push: gestion-datos-go envuelve el
// body en un $set y filtra por schema, así que un operador Mongo se descarta en
// silencio), para que la UI muestre qué se intentó y cuándo, no solo el contador.
// Los reintentos del RECONCILIADOR son jobs distintos → nodos propios, no entran acá.
export const IntentoDownlinkSchema = z.object({
  numero: z.number(), // 1..N (attemptsMade + 1)
  fecha: z.string(), // ISO del intento
  resultado: z.enum(['Enviado', 'Descartado', 'Error']),
  error: z.string().optional(), // mensaje si falló o motivo de descarte
  idComando: z.string().optional(), // IComando creado en este intento (si hubo)
  // Desglose de la latencia de este envío.
  //  - esperaColaSeg: encolado por el secuenciador → a punto de despachar
  //    (rebotes de rate limit + espera de worker). Si supera el deadline del
  //    paso, el ACK del device nunca podía llegar en plazo.
  //  - despachoSeg: duración de la llamada a api-gestion (crea el IComando y
  //    encola en Chirpstack).
  esperaColaSeg: z.number().optional(),
  despachoSeg: z.number().optional(),
});
export type IIntentoDownlink = z.infer<typeof IntentoDownlinkSchema>;

// Cómo se resolvió el PASO que este job representa. Es el VEREDICTO, y hasta
// ahora vivía solo en el plan de Redis (que se borra al finalizar) — o sea que
// después de la campaña no había forma de reconstruir por qué cerró cada paso
// sin cruzar comandos a mano.
//  - 'ack'            : ACK del device y lora aplicó la config del patch (fast-path).
//  - 'ack-no-aplicado': llegó el ACK pero la config no se escribió (hace falta el eco).
//  - 'eco'            : cerró con los uplinks de eco del GET (verificado).
//  - 'timeout'        : agotó los reintentos sin ACK/eco y se forzó el avance.
//  - 'descartado'     : device offline / sin sesión NS.
//  - 'abortado'       : el plan se cortó (breaker, reemplazo, cancelación).
export const VeredictoPasoDownlinkSchema = z.enum([
  'ack',
  'ack-no-aplicado',
  'eco',
  'timeout',
  'descartado',
  'abortado',
]);
export type VeredictoPasoDownlink = z.infer<
  typeof VeredictoPasoDownlinkSchema
>;

// Mapa de eco por SET confirmado. Lo emite api-gestion para el auto-GET
// coalescido: liga cada SET del grupo a su contribución en el byte selector del
// GET y a los puertos de uplink-eco que provoca. Permite al secuenciador
// recortar el GET solo a los SET que fallaron el ACK (OR de selectorBits) y
// recomputar los ecos esperados.
export const MapaEcoSchema = z.object({
  puertoSet: z.number(), // puerto del SET que este eco confirma
  selectorBits: z.number(), // bits en el selector del GET para pedir su eco
  ecos: z.array(z.number()), // puertos de uplink-eco que devuelve
});
export type IMapaEco = z.infer<typeof MapaEcoSchema>;

// Get encadenado tras un SET que no autoreporta su cambio. El processor lee este
// campo y, tras enviar el set, encola un nuevo job (origen='AutoGet') con el
// delay indicado.
export const ProximoGetDownlinkJobSchema = z.object({
  puerto: z.number(),
  payload: z.string(),
  delaySegundos: z.number(),
  mapaEcos: z.array(MapaEcoSchema).optional(),
});
export type IProximoGetDownlinkJob = z.infer<
  typeof ProximoGetDownlinkJobSchema
>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const DownlinkJobSchema = z.object({
  _id: z.string().optional(),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

  idDispositivoLorawan: z
    .string()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'DispositivoLorawanSchema' }),
  deveui: z.string().meta({ 'x-setter': 'uppercase' }),
  tipoDispositivo: TipoDispositivoLorawanSchema.optional(),

  origen: OrigenDownlinkJobSchema,
  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  objetivo: ObjetivoComandoSchema.optional().meta({ 'x-bson': 'mixed' }), // Procedencia: desde qué nivel/entidad se originó (se propaga al IComando)
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
  // @Prop({type: [Object]}) en el legacy: Mixed, sin casteo adentro.
  intentosLog: z.array(IntentoDownlinkSchema).optional().meta({
    'x-bson': 'mixed',
  }), // historial append-only por intento de transporte
  // Sin ref en el legacy (@Prop sin `ref`), por eso sin x-ref acá.
  idComando: z.string().optional().meta({ 'x-bson': 'objectId' }), // se llena al crear el IComando real en BD

  // ── Veredicto del paso (auditoría posterior a la campaña) ──
  // Sin estos tres campos, "cuántos pasos agotaron sus envíos", "cuántos
  // downlinks salieron después de que el paso ya había cerrado" (huérfanos) y
  // "cómo cerró cada paso" solo se podían calcular cruzando comandos a mano
  // contra el intentosLog: el plan que tenía el dato se borra al finalizar.
  veredictoPor: VeredictoPasoDownlinkSchema.optional(),
  fechaVeredicto: z.string().optional().meta({ 'x-bson': 'date' }), // cuándo cerró el paso
  agotoReintentos: z.boolean().optional(), // el paso consumió TODOS sus envíos (ack false definitivo)
  // Gateway al que el plan de este paso le ocupó cupo (o 'nogw'). Se CONGELA al
  // armar el plan. Es la única forma de reconstruir métricas por gateway después
  // (el plan vive en Redis y se borra; `dispositivo.ultimoGateway` ya cambió).
  gatewayEui: z.string().optional(),

  // Auto-get encadenado (ACTIS)
  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  proximoGet: ProximoGetDownlinkJobSchema.optional().meta({
    'x-bson': 'mixed',
  }),

  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  datosExtra: z.record(z.string(), z.any()).optional().meta({
    'x-bson': 'mixed',
  }),

  //Fechas
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  fechaProgramada: z.string().optional().meta({ 'x-bson': 'date' }), // cuando se encola en BullMQ con delay
  fechaEnviado: z.string().optional().meta({ 'x-bson': 'date' }),
  fechaConfirmado: z.string().optional().meta({ 'x-bson': 'date' }),

  //Populate
  cliente: ClienteSchema.optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idCliente',
      foreignField: '_id',
      justOne: true,
    },
  }),
  ancestros: z.array(ClienteSchema).optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idsAncestros',
      foreignField: '_id',
      justOne: false,
    },
  }),
  dispositivo: DispositivoLorawanSchema.optional().meta({
    'x-populate': {
      ref: 'DispositivoLorawanSchema',
      localField: 'idDispositivoLorawan',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'downlinkjobs' });
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


// DTO de Request individual de un downlink que se va a encolar en el secuenciador.
// Lleva el dispositivo populado (al menos los campos necesarios para el
// throttling y el envío) además del payload final ya armado.
export const DownlinkRequestSchema = z.object({
  dispositivo: DispositivoLorawanSchema,
  puerto: z.number(),
  payload: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  origen: OrigenDownlinkJobSchema,
  // En comandos manuales, el objetivo indica si el comando se envió a nivel de
  // luminaria, grupo de luminarias, puesta o grupo de puestas.
  objetivo: ObjetivoComandoSchema.optional(),
  idEjecucion: z.string().optional(),
  // Identidad de la config deseada que originó este downlink (solo reconciliación).
  idConfigDeseada: z.string().optional(),
  // Hash estable del contenido de la config deseada. Dos batches del mismo device
  // con hash DISTINTO ⇒ la deseada cambió ⇒ el plan viejo se reemplaza.
  configHash: z.string().optional(),
  // claveDedup ('<deveui>:<puerto>' por defecto). Con supersede activo, el job
  // viejo con la misma clave se cancela.
  claveDedup: z.string().optional(),
  // Prioridad BullMQ (1 = más alta). Manual pisa reconciliación.
  prioridad: z.number().optional(),
  // Delay en segundos. Útil para encadenar gets tras un set.
  delaySegundos: z.number().optional(),
  // Get encadenado tras este set (ACTIS).
  proximoGet: ProximoGetDownlinkJobSchema.optional(),
  // idUsuario que originó el downlink (null para acciones del sistema).
  idUsuario: z.string().nullable().optional(),
  // Datos extra que se propagan al IComando (ej: aspecto de la config deseada).
  datosExtra: z.record(z.string(), z.any()).optional(),
  // Política de expiresAt/flushQueue. Si no se setea, el processor decide según origen.
  expiresAtMin: z.number().optional(),
  flushQueue: z.boolean().optional(),
  confirmed: z.boolean().optional(),

  // --- Feature "aplicar config real por ACK" ---
  // El device manda un uplink de confirmación por sí mismo (algunos GPE). Determina
  // el mapeo ACK→estado en lora-luminarias: true ⇒ ACK marca 'Recibido' y el uplink
  // posterior 'Ejecutado'/'No Ejecutado' (comportamiento clásico). false ⇒ ACK true
  // marca 'Ejecutado' directo y escribe configPatch; ACK false marca 'No Recibido'.
  autoRespondeUplink: z.boolean().optional(),
  // Fragmento de config real que produce este SET. Se aplica (deep-merge) sobre
  // dispositivo.config en el ACK true cuando autoRespondeUplink=false, sin esperar
  // el uplink. Es el resultado ya mergeado (real+deseada) que calcula el builder.
  configPatch: z.record(z.string(), z.any()).optional(),
});
export type DownlinkRequest = z.infer<typeof DownlinkRequestSchema>;

// supersede: si ya hay un job activo con la misma claveDedup, se cancela y se
//   reemplaza por el nuevo.
// enqueue: se encola normalmente sin cancelar el job activo.
export const EstrategiaConflictoSchema = z.enum(['supersede', 'enqueue']);
export type EstrategiaConflicto = z.infer<typeof EstrategiaConflictoSchema>;

// Batch de varios DownlinkRequest. Se encola como un grupo identificado por
// idEjecucion (autogenerado si no viene).
export const BatchRequestSchema = z.object({
  origen: OrigenDownlinkJobSchema,
  idEjecucion: z.string().optional(),
  items: z.array(DownlinkRequestSchema),
  estrategiaConflicto: EstrategiaConflictoSchema.optional(),
});
export type BatchRequest = z.infer<typeof BatchRequestSchema>;
