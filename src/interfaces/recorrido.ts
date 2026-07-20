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
  _id: z.string().optional(),
  /**
   * @deprecated Se usa ubicacionOl.
   */
  ubicacion: CoordenadasSchema.optional(),
  ubicacionOl: CoordenadaOLSchema.optional(),
  geojson: GeoJSONPointSchema.optional(),
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

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const RecorridoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  //
  categoria: CategoriaRecorridoSchema.optional(),
  idExterno: z.string().optional(),
  idGrupo: z.string().optional(),
  nombreFlota: z.string().optional(),
  nombre: z.string().optional(),
  geojson: GeoJSONLineStringSchema.optional(),
  paradas: z.array(ParadaSchema).optional(),
  franjaHoraria: z.array(FranjaHorariaSchema).optional(),
  destino: z.string().optional(),
  por: z.string().optional(),
  color: z.string().optional(),
  duracion: z.number().optional(),
  idsUbicaciones: z.array(z.string()).optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  grupo: z.custom<IGrupo>().optional(),
  recorrido: z.array(CoordenadasSchema).optional(),
  recorridoOl: z.array(CoordenadaOLSchema).optional(),
  ubicaciones: z.array(z.custom<IUbicacion>()).optional(),
});

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
}).extend({
  recorridoOl: z.array(CoordenadaOLSchema).optional(),
});

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'grupo'
  | 'recorrido'
  | 'recorridoOl'
  | 'ubicaciones';

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
}).extend({
  recorridoOl: z.array(CoordenadaOLSchema).optional(),
});

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'grupo'
  | 'recorrido'
  | 'recorridoOl'
  | 'ubicaciones';

export interface IUpdateRecorrido
  extends Omit<Partial<IRecorrido>, OmitirUpdate> {
  recorridoOl?: ICoordenadaOL[];
}
