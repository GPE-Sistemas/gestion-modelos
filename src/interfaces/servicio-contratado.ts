import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const ServicioContratadoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  nombre: z.string().optional(),
  icono: z.string().optional(),
  costo: z.number().optional(),
  global: z.boolean().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IServicioContratado = z.infer<typeof ServicioContratadoSchema>;

export const CreateServicioContratadoSchema = ServicioContratadoSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateServicioContratado = z.infer<
  typeof CreateServicioContratadoSchema
>;

export const UpdateServicioContratadoSchema = ServicioContratadoSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateServicioContratado = z.infer<
  typeof UpdateServicioContratadoSchema
>;
