import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { DiaSchema } from './config-evento-usuario';
import type { IUbicacion } from './ubicacion';

export const TipoDeCronogramaSchema = z.enum(['despacho', 'turnos']);
export type TipoDeCronograma = z.infer<typeof TipoDeCronogramaSchema>;

export const PeriodoSchema = z.object({
  desde: z.string().optional(), // Sale
  hasta: z.string().optional(), // Llega
  datos: z.record(z.string(), z.any()).optional(), // Datos extras para el periodo, como el chofer, el vehículo, el usuario, etc
});
export type Periodo = z.infer<typeof PeriodoSchema>;

export const ConfigCronogramaSchema = z.object({
  color: z.string().optional(),
  nombreParaMostrar: z.string().optional(),
});
export type ConfigCronograma = z.infer<typeof ConfigCronogramaSchema>;

export const CronogramaSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idUbicacion: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),
  automatico: z.boolean().optional(),
  dias: z.array(DiaSchema).optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  tipo: TipoDeCronogramaSchema.optional(),
  periodos: z.array(PeriodoSchema).optional(),
  //
  configuracion: ConfigCronogramaSchema.optional(), // Colores, el nombre de de lo que se está mostrando, etc
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  // Populate hacia una union discriminada (IUbicacion): z.custom con el tipo
  // hand-written, NO UbicacionSchema. z.infer del schema union rompe el
  // narrowing por categoria al asignar un doc Mongoose en consumidores.
  ubicacion: z.custom<IUbicacion>().optional(),
});
export type ICronograma = z.infer<typeof CronogramaSchema>;

export const CreateCronogramaSchema = CronogramaSchema.omit({
  _id: true,
  cliente: true,
  ubicacion: true,
});
export type ICreateCronograma = z.infer<typeof CreateCronogramaSchema>;

export const UpdateCronogramaSchema = CronogramaSchema.omit({
  _id: true,
  cliente: true,
  ubicacion: true,
});
export type IUpdateCronograma = z.infer<typeof UpdateCronogramaSchema>;
