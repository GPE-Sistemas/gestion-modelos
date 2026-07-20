import { z } from 'zod';
import { UsuarioSchema } from './usuario';
import {
  EstadoEventoSchema,
  EstadoEventoTecnicoSchema,
} from './evento-generico';
import type { IEventoGenerico } from './evento-generico';

export const TratamientoEventoSchema = z.object({
  _id: z.string().optional(),
  //
  nota: z.string().optional(),
  notaInterna: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  estado: EstadoEventoSchema.optional(),
  // Separados para no hinche las bolas el overlap.
  estadoTecnico: EstadoEventoTecnicoSchema.optional(),
  esperaHasta: z.string().optional(),
  //
  idsEventos: z.array(z.string()).optional(),
  idUsuario: z.string().optional(),
  // Populate
  eventos: z.array(z.custom<IEventoGenerico>()).optional(),
  usuario: UsuarioSchema.optional(),
});
export type ITratamientoEvento = z.infer<typeof TratamientoEventoSchema>;

export const CreateTratamientoEventoSchema = TratamientoEventoSchema.omit({
  _id: true,
  eventos: true,
  usuario: true,
});
export type ICreateTratamientoEvento = z.infer<
  typeof CreateTratamientoEventoSchema
>;

export const UpdateTratamientoEventoSchema = TratamientoEventoSchema.omit({
  _id: true,
  eventos: true,
  usuario: true,
});
export type IUpdateTratamientoEvento = z.infer<
  typeof UpdateTratamientoEventoSchema
>;
