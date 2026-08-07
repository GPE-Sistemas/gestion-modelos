import { z } from 'zod';
import { UsuarioSchema } from './usuario';
import {
  EstadoEventoSchema,
  EstadoEventoTecnicoSchema,
} from './evento-generico';
import type { IEventoGenerico } from './evento-generico';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const TratamientoEventoSchema = z.object({
  _id: z.string().optional(),
  //
  nota: z.string().optional(),
  notaInterna: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  // @Prop({type: Object}) en el legacy: Mixed (a diferencia de
  // estadoTecnico, que es un @Prop() sin `type` — sin cast, pero no Mixed).
  estado: EstadoEventoSchema.optional().meta({ 'x-bson': 'mixed' }),
  // Separados para no hinche las bolas el overlap.
  estadoTecnico: EstadoEventoTecnicoSchema.optional(),
  esperaHasta: z.string().optional().meta({ 'x-bson': 'date' }),
  //
  idsEventos: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'EventoGenericoSchema' }),
  idUsuario: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
  // Populate
  eventos: z.array(z.custom<IEventoGenerico>()).optional().meta({
    'x-populate': {
      ref: 'EventoGenericoSchema',
      localField: 'idsEventos',
      foreignField: '_id',
      justOne: false,
    },
  }),
  usuario: UsuarioSchema.optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idUsuario',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'tratamientoeventos' });
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
