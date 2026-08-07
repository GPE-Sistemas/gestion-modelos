import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const ServicioContratadoSchema = z
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
    icono: z.string().optional(),
    costo: z.number().optional(),
    global: z.boolean().optional(),
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
  })
  .meta({ 'x-collection': 'serviciocontratados' });
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
