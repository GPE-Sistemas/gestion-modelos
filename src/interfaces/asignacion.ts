import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ActivoSchema } from './activo';
import { TrackerSchema } from './tracker';
import { UsuarioSchema } from './usuario';

export const EntidadesSchema = z.enum([
  'Chofer',
  'Activo',
  'Tracker',
  'Luminaria',
  'Cliente',
  'Alarma',
  'Vehículo',
  'Colectivo',
  'Dispositivo Lorawan',
  'Puesta',
  'Grupo',
  'Configuración de Perfil',
]);
export type IEntidades = z.infer<typeof EntidadesSchema>;

export const AsignacionSchema = z.object({
  _id: z.string().optional(),
  //
  fechaAsignacion: z.string().optional(),
  fechaDesasignacion: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idUsuario: z.string().optional(),

  // Id de la entidad a la que se le asigna algo
  idEntidadModificada: z.string().optional(),
  tipoEntidadModificada: EntidadesSchema.optional(),
  nombreEntidadModificada: z.string().optional(),
  // Id de la entidad que se asigna a la otra
  idEntidadAsignada: z.string().optional(),
  tipoEntidadAsignada: EntidadesSchema.optional(),
  nombreEntidadAsignada: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  usuario: UsuarioSchema.optional(),
  choferModificado: UsuarioSchema.optional(),
  activoModificado: ActivoSchema.optional(),
  trackerModificado: TrackerSchema.optional(),
  choferAsignado: UsuarioSchema.optional(),
  activoAsignado: ActivoSchema.optional(),
  trackerAsignado: TrackerSchema.optional(),
});
export type IAsignacion = z.infer<typeof AsignacionSchema>;

export const CreateAsignacionSchema = AsignacionSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  choferModificado: true,
  activoModificado: true,
  trackerModificado: true,
  choferAsignado: true,
  activoAsignado: true,
  trackerAsignado: true,
});
export type ICreateAsignacion = z.infer<typeof CreateAsignacionSchema>;

export const UpdateAsignacionSchema = AsignacionSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  choferModificado: true,
  activoModificado: true,
  trackerModificado: true,
  choferAsignado: true,
  activoAsignado: true,
  trackerAsignado: true,
});
export type IUpdateAsignacion = z.infer<typeof UpdateAsignacionSchema>;
