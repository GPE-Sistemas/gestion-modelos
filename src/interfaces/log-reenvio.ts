import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { DispositivoAlarmaSchema } from './dispositivo-alarma';
import { TrackerSchema } from './tracker';

export const LogReenvioSchema = z.object({
  _id: z.string().optional(),
  expireAt: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fecha: z.string().optional(),
  idEntidad: z.string().optional(),

  protocolo: z.enum(['UDP', 'TCP']).optional(),
  host: z.string().optional(),
  puerto: z.number().optional(),
  body: z.string().optional(),
  ack: z.boolean().optional(),
  error: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  dispositivoAlarma: DispositivoAlarmaSchema.optional(),
  tracker: TrackerSchema.optional(),
});
export type ILogReenvio = z.infer<typeof LogReenvioSchema>;

export const CreateLogReenvioSchema = LogReenvioSchema.omit({
  _id: true,
  cliente: true,
  dispositivoAlarma: true,
  tracker: true,
});
export type ICreateLogReenvio = z.infer<typeof CreateLogReenvioSchema>;

export const UpdateLogReenvioSchema = LogReenvioSchema.omit({
  _id: true,
  cliente: true,
  dispositivoAlarma: true,
  tracker: true,
});
export type IUpdateLogReenvio = z.infer<typeof UpdateLogReenvioSchema>;
