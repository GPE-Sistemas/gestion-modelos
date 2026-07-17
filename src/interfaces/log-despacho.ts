import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const LogDespachoSchema = z.object({
  _id: z.string(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  expireAt: z.string().optional(),
  idExternoVehiculo: z.string().optional(),
  idExternoRecorrido: z.string().optional(),
  idExternoChofer: z.string().optional(),
  fecha: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type ILogDespacho = z.infer<typeof LogDespachoSchema>;

////// CREATE
export const CreateLogDespachoSchema = LogDespachoSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type ICreateLogDespacho = z.infer<typeof CreateLogDespachoSchema>;

////// UPDATE
export const UpdateLogDespachoSchema = LogDespachoSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type IUpdateLogDespacho = z.infer<typeof UpdateLogDespachoSchema>;
