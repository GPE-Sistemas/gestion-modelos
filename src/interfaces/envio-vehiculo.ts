import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import type { IEventoGenerico } from './evento-generico';
import { UsuarioSchema } from './usuario';

export const EstadoEnvioVehiculoSchema = z.enum([
  'Asignado',
  'En Camino',
  'Rechazado',
  'Finalizado',
  'En Destino',
]);
export type EstadoEnvioVehiculo = z.infer<typeof EstadoEnvioVehiculoSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const EnvioVehiculoSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  fechaFinalizacion: z.string().optional().meta({ 'x-bson': 'date' }),
  descripcion: z.string().optional(),
  estado: EstadoEnvioVehiculoSchema.optional(),
  ///
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idConductor: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
  idsEventos: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'EventoGenericoSchema' }),
  //Usuario que lo crea
  idUsuario: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
  idActivo: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),
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
  conductor: UsuarioSchema.optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idConductor',
      foreignField: '_id',
      justOne: true,
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
  eventos: z.array(z.custom<IEventoGenerico>()).optional().meta({
    'x-populate': {
      ref: 'EventoGenericoSchema',
      localField: 'idsEventos',
      foreignField: '_id',
      justOne: false,
    },
  }),
  activo: ActivoSchema.optional().meta({
    'x-populate': {
      ref: 'ActivoSchema',
      localField: 'idActivo',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'enviovehiculos' });
export type IEnvioVehiculo = z.infer<typeof EnvioVehiculoSchema>;

export const CreateEnvioVehiculoSchema = EnvioVehiculoSchema.omit({
  _id: true,
  usuario: true,
  activo: true,
  cliente: true,
  conductor: true,
  eventos: true,
});
export type ICreateEnvioVehiculo = z.infer<typeof CreateEnvioVehiculoSchema>;

export const UpdateEnvioVehiculoSchema = EnvioVehiculoSchema.omit({
  _id: true,
  usuario: true,
  activo: true,
  cliente: true,
  conductor: true,
  eventos: true,
});
export type IUpdateEnvioVehiculo = z.infer<typeof UpdateEnvioVehiculoSchema>;
