import { z } from 'zod';
import {
  CoordenadasSchema,
  GeoJSONLineStringSchema,
  GeoJSONPointSchema,
  ICoordenadas,
  IGeoJSONLineString,
} from '../auxiliares';
import { ClienteSchema, ICliente } from './cliente';
import type { IActivo } from './activo';

/**
 * Parada de un recorrido dinámico (por puntos): un punto con radio de
 * tolerancia, sin nada del vocabulario de paradas de colectivo (sin
 * `subida`/`bajada`/`tipo`/`tiempoParada`, que no aplican acá).
 */
export const ParadaDinamicaSchema = z.object({
  _id: z.string().optional().meta({ 'x-bson': 'objectId' }),
  geojson: GeoJSONPointSchema.optional().meta({ 'x-bson': 'mixed' }),
  nombre: z.string().optional(),
  direccion: z.string().optional(),
  /**
   * Radio en metros del geofence de la parada. Sin este campo se usa el
   * default del cumplimiento (60m, ver `CumplimientoPuntosRecorridoService`).
   */
  radioMetros: z.number().optional(),
});
export type IParadaDinamica = z.infer<typeof ParadaDinamicaSchema>;

/**
 * Ventana de fecha/hora puntual (no recurrente) en la que se espera que el
 * vehículo haga este recorrido.
 */
export const VentanaRecorridoSchema = z.object({
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
});
export type IVentanaRecorrido = z.infer<typeof VentanaRecorridoSchema>;

export const DetallePuntoCumplimientoSchema = z.object({
  nombre: z.string().optional(),
  direccion: z.string().optional(),
  coordenadas: CoordenadasSchema,
  visitado: z.boolean(),
  horaLlegada: z.string().optional(),
  horaSalida: z.string().optional(),
  permanenciaSegundos: z.number(),
});
export type IDetallePuntoCumplimiento = z.infer<
  typeof DetallePuntoCumplimientoSchema
>;

/**
 * Último resultado calculado de cumplimiento: si el vehículo visitó cada
 * parada dentro de la ventana y cuánto tiempo permaneció en cada una. Se
 * recalcula on-demand (`GET /recorridos-dinamicos/:id/detalle-puntos`) y
 * queda persistido acá, para que un `GET` normal del recorrido ya traiga el
 * último resultado conocido sin tener que recalcularlo.
 */
export const DetalleCumplimientoDinamicoSchema = z
  .object({
    cumplio: z.boolean().optional(),
    calculadoEn: z.string().optional(),
    puntos: z.array(DetallePuntoCumplimientoSchema).optional(),
  })
  .meta({ 'x-bson': 'mixed' });
export type IDetalleCumplimientoDinamico = z.infer<
  typeof DetalleCumplimientoDinamicoSchema
>;

/**
 * Recorrido dinámico (por puntos): entidad separada de `Recorrido` (que es
 * por traza/cobertura). Se crea desde el planificador de rutas con un
 * vehículo, una ventana de tiempo y un conjunto de paradas ya ordenado por
 * la mejor ruta calculada (OSRM `/trip`). 1:1 con el vehículo que lo tiene
 * asignado (`idActivo`), no es una plantilla reusable.
 *
 * Populates intra-SCC como z.custom (import type-only): mismo motivo que en
 * `recorrido.ts` — un schema real acá arrastra el ciclo con `ActivoSchema` y
 * revienta TS7056 en los consumidores.
 */
export const RecorridoDinamicoSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    nombre: z.string().optional(),
    color: z.string().optional(),
    /** Línea calculada (OSRM) que conecta las paradas, para dibujarla. */
    geojson: GeoJSONLineStringSchema.optional().meta({ 'x-bson': 'mixed' }),
    paradas: z.array(ParadaDinamicaSchema).optional(),
    /** Vehículo dueño de este recorrido (1:1). */
    idActivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),
    ventana: VentanaRecorridoSchema.optional().meta({ 'x-bson': 'mixed' }),
    detalleCumplimiento: DetalleCumplimientoDinamicoSchema.optional(),
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
    activo: z.custom<IActivo>().optional().meta({
      'x-populate': {
        ref: 'ActivoSchema',
        localField: 'idActivo',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'recorridosdinamicos' });

/**
 * Interface hand-written (mismo criterio que `IRecorrido`): el ciclo con
 * `IActivo` dispara TS2589 si se usa `z.infer`.
 */
export interface IRecorridoDinamico {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  nombre?: string;
  color?: string;
  geojson?: IGeoJSONLineString;
  paradas?: IParadaDinamica[];
  idActivo?: string;
  ventana?: IVentanaRecorrido;
  detalleCumplimiento?: IDetalleCumplimientoDinamico;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  activo?: IActivo;
}

export const CreateRecorridoDinamicoSchema = RecorridoDinamicoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  activo: true,
  detalleCumplimiento: true,
});

type OmitirCreateDinamico =
  | '_id'
  | 'cliente'
  | 'ancestros'
  | 'activo'
  | 'detalleCumplimiento';

export interface ICreateRecorridoDinamico
  extends Omit<Partial<IRecorridoDinamico>, OmitirCreateDinamico> {}

export const UpdateRecorridoDinamicoSchema = RecorridoDinamicoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  activo: true,
});

type OmitirUpdateDinamico = '_id' | 'cliente' | 'ancestros' | 'activo';

export interface IUpdateRecorridoDinamico
  extends Omit<Partial<IRecorridoDinamico>, OmitirUpdateDinamico> {}
