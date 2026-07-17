import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const TipoListadoCategoriaSchema = z.enum([
  //PARA TIPOS DE EVENTOS
  'Evento-Alarma',
  'Evento-Tracker',
  'Evento-Luminaria',
  'Evento-Sirena',
  'Evento-Gateway',
  'Evento-Activo',
  //PARA EMERGENCIAS MÉDICAS
  'Sintomas',
  'Diagnosticos',
  //PARA SERVICIOS TÉCNICOS
  'Evento-Tecnico-Tracker',
  'Evento-Tecnico-Alarma',
  'Evento-Tecnico-Vehiculo',
  'Evento-Tecnico-Luminaria',
  'Evento-Tecnico-Sirena',
  'Evento-Tecnico-Gateway',
  'Evento-Tecnico-Activo',
]);
export type ITipoListadoCategoria = z.infer<typeof TipoListadoCategoriaSchema>;

export const ListadoCategoriaSchema = z.object({
  _id: z.string().optional(),
  //
  nombre: z.string().optional(),
  categoria: TipoListadoCategoriaSchema.optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  default: z.boolean().optional(),
  global: z.boolean().optional(),
  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IListadoCategoria = z.infer<typeof ListadoCategoriaSchema>;

export const CreateListadoCategoriaSchema = ListadoCategoriaSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateListadoCategoria = z.infer<
  typeof CreateListadoCategoriaSchema
>;

export const UpdateListadoCategoriaSchema = ListadoCategoriaSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateListadoCategoria = z.infer<
  typeof UpdateListadoCategoriaSchema
>;

export const ListadoCategoriaCacheSchema = ListadoCategoriaSchema.omit({
  cliente: true,
  ancestros: true,
});
export type IListadoCategoriaCache = z.infer<
  typeof ListadoCategoriaCacheSchema
>;
