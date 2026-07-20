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

export const EnvioVehiculoSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fechaFinalizacion: z.string().optional(),
  descripcion: z.string().optional(),
  estado: EstadoEnvioVehiculoSchema.optional(),
  ///
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idConductor: z.string().optional(),
  idsEventos: z.array(z.string()).optional(),
  //Usuario que lo crea
  idUsuario: z.string().optional(),
  idActivo: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  conductor: UsuarioSchema.optional(),
  usuario: UsuarioSchema.optional(),
  eventos: z.array(z.custom<IEventoGenerico>()).optional(),
  activo: ActivoSchema.optional(),
});
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
