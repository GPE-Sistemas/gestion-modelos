import { z } from 'zod';
import {
  CoordenadaOLSchema,
  CoordenadasSchema,
  GeoJSONLineStringSchema,
  GeoJSONPointSchema,
  ICoordenadaOL,
  ICoordenadas,
  IGeoJSONLineString,
} from '../auxiliares';
import { ClienteSchema, ICliente } from './cliente';
import type { IGrupo } from './grupo';
import type { IUbicacion } from './ubicacion';

export const TipoParadaSchema = z.enum(['refugio', 'parada']);
export type ITipoParada = z.infer<typeof TipoParadaSchema>;

export const ParadaSchema = z.object({
  // Subdocumento CON _id (el único del legacy): el front filtra recorridos por
  // {paradas._id}, así que ese path necesita el casteo a ObjectId.
  _id: z.string().optional().meta({ 'x-bson': 'objectId' }),
  /**
   * @deprecated Se usa ubicacionOl.
   */
  ubicacion: CoordenadasSchema.optional().meta({ 'x-bson': 'mixed' }),
  ubicacionOl: CoordenadaOLSchema.optional(),
  geojson: GeoJSONPointSchema.optional().meta({ 'x-bson': 'mixed' }),
  nombre: z.string().optional(),
  direccion: z.string().optional(),
  destino: z.string().optional(),
  por: z.string().optional(),
  subida: z.boolean().optional(),
  bajada: z.boolean().optional(),
  tipo: TipoParadaSchema.optional(),
  /**
   * Tiempo que se suma al recorrido, es lo que se estima que tarda el colectivo en esa parada
   */
  tiempoParada: z.number().optional(),
});
export type IParada = z.infer<typeof ParadaSchema>;

export const FranjaHorariaSchema = z.object({
  dia: z.number().optional(), // Número de 0 a 6, siendo 0 el domingo
  desde: z.string().optional(),
  hasta: z.string().optional(),
  frecuenciaMinutos: z.number().optional(),
});
export type IFranjaHoraria = z.infer<typeof FranjaHorariaSchema>;

export const CategoriaRecorridoSchema = z.enum(['Colectivo', 'Vehiculo']);
export type ICategoriaRecorrido = z.infer<typeof CategoriaRecorridoSchema>;

/**
 * Configuración de medición de cumplimiento del recorrido (real vs deseado).
 * Sólo aplica a recorridos de categoría 'Vehiculo'.
 *
 * La medición es por cobertura de tramos ("buckets") sobre el `geojson`: cada
 * reporte del vehículo se proyecta sobre la traza y marca el bucket en el que
 * cae, siempre que esté a menos de `toleranciaMetros` de la línea. El
 * porcentaje es `bucketsCubiertos / cantidadBuckets`.
 */
export const ConfigCumplimientoRecorridoSchema = z.object({
  /**
   * Habilita la medición. Si está en false no se calcula nada (no hay costo en
   * el camino del reporte).
   */
  activo: z.boolean().optional(),
  /**
   * Distancia perpendicular máxima a la traza para considerar que el punto está
   * sobre el recorrido. Sugerido 30-40 m urbano, 80-120 m ruta (se mide sobre
   * la coordenada snappeada del reporte). Si no está, se usa el default del
   * cliente.
   */
  toleranciaMetros: z.number().optional(),
  /**
   * Exige cubrir la traza. Es el criterio principal.
   */
  porCobertura: z.boolean().optional(),
  /**
   * Exige hacerlo en el tiempo esperado (`duracion` del recorrido, en minutos).
   */
  porTiempo: z.boolean().optional(),
  /**
   * Margen sobre `duracion` para aprobar el cumplimiento temporal. Default 20.
   */
  toleranciaTiempoPorcentaje: z.number().optional(),
  /**
   * Porcentaje de cobertura mínimo para cerrar la sesión como 'Completado'.
   * Default 100 (hay que llegar al último bucket).
   */
  minimoPorcentaje: z.number().optional(),
  /**
   * El recorrido vuelve al punto de partida. El porcentaje se mide por vuelta:
   * al pasar por el cierre se persiste la vuelta y se reinicia la cobertura.
   */
  esCiclico: z.boolean().optional(),
  /**
   * Exige avanzar en el sentido en el que está dibujada la traza. Un punto que
   * retrocede más de `ventanaRetrocesoBuckets` no marca cobertura.
   * Default true.
   */
  respetarOrden: z.boolean().optional(),
  /**
   * Tolerancia de retroceso (en buckets) para absorber jitter de GPS y
   * maniobras sin habilitar recorrer la traza al revés. Default 2.
   */
  ventanaRetrocesoBuckets: z.number().optional(),
  /**
   * La sesión sólo arranca si el primer punto on-route está cerca del comienzo
   * de la traza. Evita penalizar el trayecto desde la base. Default true.
   */
  inicioEstricto: z.boolean().optional(),
  /**
   * Minutos sin reportes on-route tras los cuales se cierra la sesión.
   * Default 30.
   */
  timeoutMinutos: z.number().optional(),
  /**
   * Exige cubrir la traza en los dos sentidos (recorridos de ida y vuelta por
   * la misma calle). Previsto, todavía no implementado.
   */
  requiereAmbosSentidos: z.boolean().optional(),
});
export type IConfigCumplimientoRecorrido = z.infer<
  typeof ConfigCumplimientoRecorridoSchema
>;

/**
 * Preproceso de la geometría, calculado por el backend al crear/editar el
 * recorrido. No lo manda el frontend.
 */
export const GeometriaRecorridoSchema = z.object({
  /** Largo total de la traza en metros. */
  longitudMetros: z.number().optional(),
  /**
   * Largo de cada bucket, relativo al largo total y topeado por la precisión
   * del GPS: `clamp(longitudMetros / 100, 15, 200)`.
   */
  largoBucketMetros: z.number().optional(),
  /** Cantidad de buckets: `ceil(longitudMetros / largoBucketMetros)`. */
  cantidadBuckets: z.number().optional(),
  /**
   * Hash de la geometría + `largoBucketMetros`. Versiona la traza: si cambia
   * mientras hay sesiones abiertas, esas sesiones se abortan porque los
   * índices de bucket dejan de ser comparables.
   */
  hash: z.string().optional(),
  /** Primer punto ≈ último punto (detectado al guardar). */
  cerrado: z.boolean().optional(),
});
export type IGeometriaRecorrido = z.infer<typeof GeometriaRecorridoSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS. Medido en el spike de
// la etapa 1 (2026-08-05): con schemas reales acá, TS7056 revienta en los
// archivos que EMBEBEN esta entidad, no acá.
//
// La metadata de persistencia va por `.meta()` justamente por eso: es aditiva y
// no toca la inferencia. Convención documentada en proveedor.ts.
export const RecorridoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  //
  categoria: CategoriaRecorridoSchema.optional(),
  idExterno: z.string().optional(),
  idGrupo: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'GrupoSchema' }),
  nombreFlota: z.string().optional(),
  nombre: z.string().optional(),
  geojson: GeoJSONLineStringSchema.optional().meta({ 'x-bson': 'mixed' }),
  paradas: z.array(ParadaSchema).optional(),
  franjaHoraria: z
    .array(FranjaHorariaSchema)
    .optional()
    .meta({ 'x-bson': 'mixed' }),
  destino: z.string().optional(),
  por: z.string().optional(),
  color: z.string().optional(),
  duracion: z.number().optional(),
  idsUbicaciones: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UbicacionSchema' }),
  // Cumplimiento (categoría 'Vehiculo')
  cumplimiento: ConfigCumplimientoRecorridoSchema.optional().meta({
    'x-bson': 'mixed',
  }),
  geometria: GeometriaRecorridoSchema.optional().meta({ 'x-bson': 'mixed' }),
  // Populate
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
  grupo: z.custom<IGrupo>().optional().meta({
    'x-populate': {
      ref: 'GrupoSchema',
      localField: 'idGrupo',
      foreignField: '_id',
      justOne: true,
    },
  }),
  // Getters computados del toJSON legacy (geojson → {lat,lng}[] y proj4
  // EPSG:3857): no son campos del schema ni populates, y por eso no van en
  // Fields ni llevan casteo. Ver recorridos/tojson.go en gestion-datos-go.
  recorrido: z
    .array(CoordenadasSchema)
    .optional()
    .meta({ 'x-computed': true }),
  recorridoOl: z
    .array(CoordenadaOLSchema)
    .optional()
    .meta({ 'x-computed': true }),
  ubicaciones: z.array(z.custom<IUbicacion>()).optional().meta({
    'x-populate': {
      ref: 'UbicacionSchema',
      localField: 'idsUbicaciones',
      foreignField: '_id',
      justOne: false,
    },
  }),
}).meta({ 'x-collection': 'recorridos' });

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
export interface IRecorrido {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  //
  categoria?: ICategoriaRecorrido;
  idExterno?: string;
  idGrupo?: string;
  nombreFlota?: string;
  nombre?: string;
  geojson?: IGeoJSONLineString;
  paradas?: IParada[];
  franjaHoraria?: IFranjaHoraria[];
  destino?: string;
  por?: string;
  color?: string;
  duracion?: number;
  idsUbicaciones?: string[];
  // Cumplimiento (categoría 'Vehiculo')
  cumplimiento?: IConfigCumplimientoRecorrido;
  geometria?: IGeometriaRecorrido;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  grupo?: IGrupo;
  recorrido?: ICoordenadas[];
  recorridoOl?: ICoordenadaOL[];
  ubicaciones?: IUbicacion[];
}

export const CreateRecorridoSchema = RecorridoSchema.omit({
  _id: true,
  cliente: true,
  grupo: true,
  recorrido: true,
  recorridoOl: true,
  ubicaciones: true,
  // Lo calcula api-datos a partir del geojson.
  geometria: true,
}).extend({
  recorridoOl: z.array(CoordenadaOLSchema).optional(),
});

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'grupo'
  | 'recorrido'
  | 'recorridoOl'
  | 'ubicaciones'
  | 'geometria';

export interface ICreateRecorrido
  extends Omit<Partial<IRecorrido>, OmitirCreate> {
  recorridoOl?: ICoordenadaOL[];
}

export const UpdateRecorridoSchema = RecorridoSchema.omit({
  _id: true,
  cliente: true,
  grupo: true,
  recorrido: true,
  recorridoOl: true,
  ubicaciones: true,
  // Lo recalcula api-datos cuando cambia el geojson.
  geometria: true,
}).extend({
  recorridoOl: z.array(CoordenadaOLSchema).optional(),
});

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'grupo'
  | 'recorrido'
  | 'recorridoOl'
  | 'ubicaciones'
  | 'geometria';

export interface IUpdateRecorrido
  extends Omit<Partial<IRecorrido>, OmitirUpdate> {
  recorridoOl?: ICoordenadaOL[];
}
