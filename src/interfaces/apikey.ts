import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const ModuloSchema = z.enum(['flotas', 'alarmas']);
export type Modulo = z.infer<typeof ModuloSchema>;

export const ApikeySchema = z.object({
  _id: z.string().optional(),
  //
  identificacion: z.string().optional(),
  key: z.string().optional(),
  // Permisos
  global: z.boolean().optional(), // Si es global, no se le asignan clientes
  idCreador: z.string().optional(), // Si es global. Es lo que puede ver ese cliente.
  idClientes: z.array(z.string()).optional(), // Si no es global, se le asignan clientes
  modulos: z.array(ModuloSchema).optional(), // Flotas - Alarmas - etc

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(), // Este sería el creador
  clientes: z.array(ClienteSchema).optional(), // Estos son los elegidos para ver
});
export type IApikey = z.infer<typeof ApikeySchema>;

export const CreateApikeySchema = ApikeySchema.omit({
  _id: true,
  clientes: true,
});
export type ICreateApikey = z.infer<typeof CreateApikeySchema>;

export const UpdateApikeySchema = ApikeySchema.omit({
  _id: true,
  clientes: true,
});
export type IUpdateApikey = z.infer<typeof UpdateApikeySchema>;
