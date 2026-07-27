import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { RecorridoSchema } from './recorrido';

/**
 * Estado de una sesión de cumplimiento:
 * - `En curso`: el vehículo está midiendo contra la traza.
 * - `Completado`: alcanzó el `minimoPorcentaje` de cobertura configurado.
 * - `Incompleto`: se cerró (por timeout, desasignación o fin de día) sin
 *   alcanzar el mínimo.
 * - `Abortado`: se editó la geometría del recorrido mientras la sesión estaba
 *   abierta, así que los índices de bucket dejaron de ser comparables.
 */
export const EstadoCumplimientoRecorridoSchema = z.enum([
  'En curso',
  'Completado',
  'Incompleto',
  'Abortado',
]);
export type IEstadoCumplimientoRecorrido = z.infer<
  typeof EstadoCumplimientoRecorridoSchema
>;

/**
 * Motivo por el que se cerró la sesión. Sirve para distinguir un recorrido
 * mal hecho de un problema de datos (tracker sin reportar).
 */
export const MotivoCierreCumplimientoSchema = z.enum([
  'Recorrido completo',
  'Vuelta cerrada',
  'Recorrido desasignado',
  'Sin reportes',
  'Fin de dia',
  'Geometria modificada',
  'Reinicio manual',
]);
export type IMotivoCierreCumplimiento = z.infer<
  typeof MotivoCierreCumplimientoSchema
>;

/**
 * Registro de una pasada de un vehículo por su recorrido asignado (real vs
 * deseado). Es un log de hechos, como `ITrackeo` para colectivos: un documento
 * por sesión, y en recorridos cíclicos un documento por vuelta.
 *
 * Lo genera api-eventos: la cobertura se acumula en Redis mientras la sesión
 * está abierta (bitmap con SETBIT) y se persiste este documento recién al
 * cerrar. El porcentaje en vivo NO sale de acá, sale de Redis.
 */
export const CumplimientoRecorridoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  //
  idActivo: z.string().optional(),
  idRecorrido: z.string().optional(),
  /**
   * Hash de la geometría contra la que se midió. Snapshot: si el recorrido se
   * edita después, este documento sigue siendo interpretable.
   */
  hashGeometria: z.string().optional(),
  /** Número de vuelta dentro de la asignación (1..n). */
  numeroVuelta: z.number().optional(),
  //
  /** Primer reporte on-route que arrancó la medición. */
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  duracionMinutos: z.number().optional(),
  //
  /** Cobertura lograda, 0..100. */
  porcentajeCobertura: z.number().optional(),
  bucketsCubiertos: z.number().optional(),
  cantidadBuckets: z.number().optional(),
  /**
   * Bitmap de buckets cubiertos en base64 (1 bit por bucket). Es la evidencia
   * auditable de qué tramos se hicieron: permite redibujar la cobertura y
   * sostener una futura facturación.
   */
  segmentosCubiertos: z.string().optional(),
  metrosCubiertos: z.number().optional(),
  metrosTotales: z.number().optional(),
  //
  /**
   * Metros recorridos fuera de la tolerancia de la traza. Sólo informativo: no
   * penaliza más allá de no sumar cobertura.
   */
  metrosFueraDeRuta: z.number().optional(),
  cantidadPuntosFueraDeRuta: z.number().optional(),
  /**
   * Puntos descartados por retroceder más allá de la ventana permitida
   * (recorrido hecho al revés o desordenado).
   */
  cantidadPuntosFueraDeSecuencia: z.number().optional(),
  //
  /**
   * Diferencia entre la duración real y la esperada, en minutos. Positivo =
   * atrasado.
   */
  desvioMinutos: z.number().optional(),
  cumplioTiempo: z.boolean().optional(),
  cumplioCobertura: z.boolean().optional(),
  //
  // Snapshot de la configuración usada, para que el número sea auditable
  // aunque después cambien los parámetros del recorrido.
  toleranciaMetros: z.number().optional(),
  duracionEsperada: z.number().optional(),
  minimoPorcentaje: z.number().optional(),
  //
  estado: EstadoCumplimientoRecorridoSchema.optional(),
  motivoCierre: MotivoCierreCumplimientoSchema.optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  activo: ActivoSchema.optional(),
  recorrido: RecorridoSchema.optional(),
});
export type ICumplimientoRecorrido = z.infer<
  typeof CumplimientoRecorridoSchema
>;

export const CreateCumplimientoRecorridoSchema =
  CumplimientoRecorridoSchema.omit({
    _id: true,
    cliente: true,
    ancestros: true,
    activo: true,
    recorrido: true,
  });
export type ICreateCumplimientoRecorrido = z.infer<
  typeof CreateCumplimientoRecorridoSchema
>;

export const UpdateCumplimientoRecorridoSchema =
  CumplimientoRecorridoSchema.omit({
    _id: true,
    cliente: true,
    ancestros: true,
    activo: true,
    recorrido: true,
  });
export type IUpdateCumplimientoRecorrido = z.infer<
  typeof UpdateCumplimientoRecorridoSchema
>;

/**
 * Snapshot en vivo de la sesión abierta de un vehículo, servido por
 * api-gestion leyendo Redis. No es un documento de Mongo: es lo que consume el
 * panel del mapa mientras el vehículo está haciendo el recorrido.
 */
export const CumplimientoRecorridoVivoSchema = z.object({
  idActivo: z.string().optional(),
  idRecorrido: z.string().optional(),
  /**
   * `Sin iniciar`: hay recorrido asignado pero todavía no arrancó la medición.
   * `En recorrido` / `Desviado`: según dónde cayó el último reporte.
   * `Completado`: llegó al mínimo de cobertura.
   */
  estado: z
    .enum(['Sin iniciar', 'En recorrido', 'Desviado', 'Completado'])
    .optional(),
  numeroVuelta: z.number().optional(),
  fechaInicio: z.string().optional(),
  //
  porcentajeCobertura: z.number().optional(),
  bucketsCubiertos: z.number().optional(),
  cantidadBuckets: z.number().optional(),
  /** Bitmap base64, para pintar la traza cubierta vs pendiente en el mapa. */
  segmentosCubiertos: z.string().optional(),
  metrosCubiertos: z.number().optional(),
  metrosTotales: z.number().optional(),
  //
  duracionMinutos: z.number().optional(),
  duracionEsperada: z.number().optional(),
  /**
   * Atraso contra el esperado prorrateado por avance
   * (`transcurrido - duracionEsperada * cobertura`). Positivo = atrasado.
   */
  desvioMinutos: z.number().optional(),
  estadoTiempo: z.enum(['En hora', 'Atrasado', 'Adelantado']).optional(),
  //
  metrosFueraDeRuta: z.number().optional(),
  /** Distancia del último reporte a la traza, en metros. */
  distanciaAlRecorrido: z.number().optional(),
  fechaUltimoReporte: z.string().optional(),
  //
  porCobertura: z.boolean().optional(),
  porTiempo: z.boolean().optional(),
});
export type ICumplimientoRecorridoVivo = z.infer<
  typeof CumplimientoRecorridoVivoSchema
>;
