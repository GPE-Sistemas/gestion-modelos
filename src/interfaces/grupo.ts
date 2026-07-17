import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import type { IConfigPerfil } from './config-perfil';

export const CategoriaGrupoSchema = z.enum([
  'Línea de colectivo',
  'Flota',
  'Activo',
  'Normal',
  'Luminaria',
  'Puesta',
]);
export type CategoriaGrupo = z.infer<typeof CategoriaGrupoSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const GrupoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  nombre: z.string().optional(),
  color: z.string().optional(),
  categoria: CategoriaGrupoSchema.optional(),
  idsPerfilConfig: z.array(z.string()).optional(),
  prioridad: z.number().optional(),

  // Integracion Soflex
  fleetId: z.string().optional(),
  parentFleetId: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  perfilConfigs: z.array(z.custom<IConfigPerfil>()).optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
export interface IGrupo {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  nombre?: string;
  color?: string;
  categoria?: CategoriaGrupo;
  idsPerfilConfig?: string[];
  prioridad?: number;

  // Integracion Soflex
  fleetId?: string;
  parentFleetId?: string;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  perfilConfigs?: IConfigPerfil[];
}

export const CreateGrupoSchema = GrupoSchema.omit({
  _id: true,
  cliente: true,
});

type OmitirCreate = '_id' | 'cliente';

export interface ICreateGrupo extends Omit<Partial<IGrupo>, OmitirCreate> {}

export const UpdateGrupoSchema = GrupoSchema.omit({
  _id: true,
  cliente: true,
});

type OmitirUpdate = '_id' | 'cliente';

export interface IUpdateGrupo extends Omit<Partial<IGrupo>, OmitirUpdate> {}
