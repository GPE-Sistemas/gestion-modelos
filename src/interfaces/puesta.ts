import { z } from 'zod';
import { GeoJSONPointSchema, IGeoJSONPoint } from '../auxiliares';
import { ClienteSchema, ICliente } from './cliente';
import type { IConfigPerfil } from './config-perfil';
import type { IGrupo } from './grupo';
import type { ILuminaria } from './luminaria';

/**
 * Puesta = soporte físico / punto de luz del alumbrado (columna, poste, ménsula de fachada, colgante).
 * Agrupa 1..N luminarias y porta la georreferencia.
 *
 * Es OPCIONAL en el sistema: solo se usa para clientes con
 * `cliente.config.moduloLuminarias.usaPuestas`. La luminaria adquiere la `ubicacion` desde su puesta.
 */
export const PuestaSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),

  identificacion: z.string().optional(),
  ubicacion: GeoJSONPointSchema.optional(), // fuente de verdad de la georreferencia, es la que adquieren las luminarias asignadas a esta puesta
  direccion: z.string().optional(),

  idsGrupos: z.array(z.string()).optional(),
  idsPerfilConfig: z.array(z.string()).optional(), // Perfil(es) a nivel puesta

  // Virtuals
  // Populates intra-SCC como z.custom (import type-only): un schema real acá
  // arrastra el shape completo del ciclo y revienta la serialización de
  // declarations (TS7056) acá y en los consumidores NestJS.
  luminarias: z.array(z.custom<ILuminaria>()).optional(), // luminaria.idPuesta == puesta._id
  grupos: z.array(z.custom<IGrupo>()).optional(),
  perfilConfigs: z.array(z.custom<IConfigPerfil>()).optional(),
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});

/**
 * Interface hand-written (misma forma que z.infer<typeof PuestaSchema>).
 * NO usar z.infer acá: el ciclo puesta ↔ luminaria a través de dos z.infer
 * mutuamente recursivos dispara TS2589; la interface corta el ciclo porque
 * TS la resuelve lazy.
 */
export interface IPuesta {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  identificacion?: string;
  ubicacion?: IGeoJSONPoint;
  direccion?: string;
  idsGrupos?: string[];
  idsPerfilConfig?: string[];
  // Virtuals
  luminarias?: ILuminaria[];
  grupos?: IGrupo[];
  perfilConfigs?: IConfigPerfil[];
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreateUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'idsAncestros'
  | 'luminarias'
  | 'grupos'
  | 'perfilConfigs'
  | 'cliente'
  | 'ancestros';

////// CREATE
export const CreatePuestaSchema = PuestaSchema.omit({
  _id: true,
  fechaCreacion: true,
  idsAncestros: true,
  luminarias: true,
  grupos: true,
  perfilConfigs: true,
  cliente: true,
  ancestros: true,
});
export type ICreatePuesta = Omit<IPuesta, OmitirCreateUpdate>;

////// UPDATE
export const UpdatePuestaSchema = PuestaSchema.omit({
  _id: true,
  fechaCreacion: true,
  idsAncestros: true,
  luminarias: true,
  grupos: true,
  perfilConfigs: true,
  cliente: true,
  ancestros: true,
});
export type IUpdatePuesta = Omit<IPuesta, OmitirCreateUpdate>;
