import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { CategoriaEventoSchema } from './categoria-evento';

export const CodigoDispositivoEntradaSchema = z.object({
  codigo: z.string().optional(),
  descripcion: z.string().optional(),
  idCategoriaEvento: z.string().optional(),
  // Populate
  categoriaEvento: CategoriaEventoSchema.optional(),
});
export type ICodigoDispositivoEntrada = z.infer<
  typeof CodigoDispositivoEntradaSchema
>;

export const FlagsTrackersSchema = z.enum([
  'Posicion',
  'Ignición',
  'Emergencia',
  'Batería',
]);
export type FlagsTrackers = z.infer<typeof FlagsTrackersSchema>;

export const CodigoDispositivoEntradaCacheSchema =
  CodigoDispositivoEntradaSchema.omit({
    categoriaEvento: true,
  });
export type ICodigoDispositivoEntradaCache = z.infer<
  typeof CodigoDispositivoEntradaCacheSchema
>;

export const CodigoDispositivoSchema = z.object({
  codigo: z.string().optional(),
  descripcion: z.string().optional(),
  idCategoriaEvento: z.string().optional(),
  mostrarZona: z.boolean().optional(),
  mostrarUsuario: z.boolean().optional(),
  armado: z.boolean().optional(),
  desarmado: z.boolean().optional(),
  detonacion: z.boolean().optional(),
  test: z.boolean().optional(),
  notificar: z.boolean().optional(),
  minutosEsperaAutomatica: z.number().optional(), // Los eventos generados se ponen en espera automaticamente por este tiempo
  cierraCodigosEventos: z.array(z.string()).optional(), // Si se genera un evento con este codigo, se cierran los eventos con estos codigos del array

  flagsTrackers: z.array(FlagsTrackersSchema).optional(),
  // Populate
  categoriaEvento: CategoriaEventoSchema.optional(),
});
export type ICodigoDispositivo = z.infer<typeof CodigoDispositivoSchema>;

export const CodigoDispositivoCacheSchema = CodigoDispositivoSchema.omit({
  categoriaEvento: true,
});
export type ICodigoDispositivoCache = z.infer<
  typeof CodigoDispositivoCacheSchema
>;

export const TipoDispositivoSchema = z.enum([
  'Tracker',
  'Alarma',
  'Comunicador',
  'NVR',
  'Cámara',
  'Luminaria',
  'DispositivoLorawan',
  'BotonBLE',
  'Sirena',
]);
export type TipoDispositivo = z.infer<typeof TipoDispositivoSchema>;

export const CodigosDispositivoSchema = z.object({
  _id: z.string().optional(),
  //
  nombre: z.string().optional(),
  tipo: TipoDispositivoSchema.optional(),
  codigos: z.array(CodigoDispositivoSchema).optional(),
  codigosEntrada: z.array(CodigoDispositivoEntradaSchema).optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  global: z.boolean().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type ICodigosDispositivo = z.infer<typeof CodigosDispositivoSchema>;

export const CodigosDispositivoCacheSchema = CodigosDispositivoSchema.omit({
  cliente: true,
  ancestros: true,
  codigos: true,
  codigosEntrada: true,
}).extend({
  codigos: z.array(CodigoDispositivoCacheSchema).optional(),
  codigosEntrada: z.array(CodigoDispositivoEntradaCacheSchema).optional(),
});
export type ICodigosDispositivoCache = z.infer<
  typeof CodigosDispositivoCacheSchema
>;

export const CreateCodigosDispositivoSchema = CodigosDispositivoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
});
export type ICreateCodigosDispositivo = z.infer<
  typeof CreateCodigosDispositivoSchema
>;

export const UpdateCodigosDispositivoSchema = CodigosDispositivoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
});
export type IUpdateCodigosDispositivo = z.infer<
  typeof UpdateCodigosDispositivoSchema
>;
