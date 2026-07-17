import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { CronogramaSchema } from './cronograma';
import { RecorridoSchema } from './recorrido';
import { UsuarioSchema } from './usuario';

export const DespachoSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idUsuario: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),
  fecha: z.string().optional(),
  hora: z.string().optional(), // Sale
  salio: z.string().optional(), // Salió
  idCronograma: z.string().optional(),
  idActivo: z.string().optional(),
  idChofer: z.string().optional(),
  idsRecorridos: z.array(z.string()).optional(),
  idRecorridoActual: z.string().optional(),
  completado: z.boolean().optional(), /// Que los datos son iguales al cronograma
  cancelado: z.boolean().optional(), /// Que el despacho fue cancelado
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  usuario: UsuarioSchema.optional(),
  activo: ActivoSchema.optional(),
  chofer: UsuarioSchema.optional(),
  recorridos: z.array(RecorridoSchema).optional(),
  cronograma: CronogramaSchema.optional(),
});
export type IDespacho = z.infer<typeof DespachoSchema>;

export const CreateDespachoSchema = DespachoSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  fechaCreacion: true,
  activo: true,
  chofer: true,
  recorridos: true,
  cronograma: true,
});
export type ICreateDespacho = z.infer<typeof CreateDespachoSchema>;

export const UpdateDespachoSchema = DespachoSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  fechaCreacion: true,
  activo: true,
  chofer: true,
  recorridos: true,
  cronograma: true,
});
export type IUpdateDespacho = z.infer<typeof UpdateDespachoSchema>;
