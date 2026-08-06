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

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const AsignacionSchema = z.object({
  _id: z.string().optional(),
  //
  fechaAsignacion: z.string().optional().meta({ 'x-bson': 'date' }),
  fechaDesasignacion: z.string().optional().meta({ 'x-bson': 'date' }),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idUsuario: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),

  // Id de la entidad a la que se le asigna algo. Polimórfico según
  // tipoEntidadModificada (Chofer/Activo/Tracker/...): sin ref fijo en el
  // legacy (@Prop sin `ref`), por eso sin x-ref acá tampoco.
  idEntidadModificada: z.string().optional().meta({ 'x-bson': 'objectId' }),
  tipoEntidadModificada: EntidadesSchema.optional(),
  nombreEntidadModificada: z.string().optional(),
  // Id de la entidad que se asigna a la otra. Mismo polimorfismo que arriba.
  idEntidadAsignada: z.string().optional().meta({ 'x-bson': 'objectId' }),
  tipoEntidadAsignada: EntidadesSchema.optional(),
  nombreEntidadAsignada: z.string().optional(),

  // Populate
  cliente: ClienteSchema.optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idCliente',
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
  choferModificado: UsuarioSchema.optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idEntidadModificada',
      foreignField: '_id',
      justOne: true,
    },
  }),
  activoModificado: ActivoSchema.optional().meta({
    'x-populate': {
      ref: 'ActivoSchema',
      localField: 'idEntidadModificada',
      foreignField: '_id',
      justOne: true,
    },
  }),
  trackerModificado: TrackerSchema.optional().meta({
    'x-populate': {
      ref: 'TrackerSchema',
      localField: 'idEntidadModificada',
      foreignField: '_id',
      justOne: true,
    },
  }),
  choferAsignado: UsuarioSchema.optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idEntidadAsignada',
      foreignField: '_id',
      justOne: true,
    },
  }),
  activoAsignado: ActivoSchema.optional().meta({
    'x-populate': {
      ref: 'ActivoSchema',
      localField: 'idEntidadAsignada',
      foreignField: '_id',
      justOne: true,
    },
  }),
  trackerAsignado: TrackerSchema.optional().meta({
    'x-populate': {
      ref: 'TrackerSchema',
      localField: 'idEntidadAsignada',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'asignacions' });
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
