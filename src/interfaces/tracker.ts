import { z } from 'zod';
import type { IActivo } from './activo';
import {
  ClienteSchema,
  ConfigHorarioSchema,
  ICliente,
  IConfigHorario,
} from './cliente';
import type { ISim } from './dispositivo-alarma';
import type { estadoCuenta } from './estado-entidad';
import {
  IModeloDispositivo,
  ModeloDispositivoSchema,
} from './modelo-dispositivo';
import {
  IServicioContratado,
  ServicioContratadoSchema,
} from './servicio-contratado';

export const TipoTrackerSchema = z.enum([
  'Qualcomm',
  'GPRS',
  'T1000-B',
  'Telefono',
]);
export type TipoTracker = z.infer<typeof TipoTrackerSchema>;

export const T100bDeviceSchema = z.object({
  deveui: z.string().optional(),
});
export type IT100bDevice = z.infer<typeof T100bDeviceSchema>;

export const QualcommDeviceSchema = z.object({
  // Datos de Qualcomm
  serialNumber: z.string().optional(),
});
export type IQualcommDevice = z.infer<typeof QualcommDeviceSchema>;

export const TelefonoSchema = z.object({
  deviceId: z.string().optional(),
});
export type ITelefono = z.infer<typeof TelefonoSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const TrackerSchema = z.object({
  _id: z.string().optional(),
  //
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  fechaAlta: z.string().optional().meta({ 'x-bson': 'date' }),
  imagenes: z.array(z.string()).optional(),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsClientesQuePuedenAtenderEventos: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsClientesQuePuedenAtenderEventosTecnicos: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  puedeSolicitarServicioTecnico: z.boolean().optional(),
  // @Prop({type: [Object]}) en el legacy: array real de Mixed.
  configHorariosAtencion: z
    .array(ConfigHorarioSchema)
    .optional()
    .meta({ 'x-bson': 'mixed' }),
  configHorariosAtencionTecnica: z
    .array(ConfigHorarioSchema)
    .optional()
    .meta({ 'x-bson': 'mixed' }),
  idModelo: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ModeloDispositivoSchema' }),
  nombre: z.string().optional(),
  identificacion: z.string().optional(),
  // @Prop() string plano: el populate por "activo" castea hex → OID
  // (CLAUDE.md §7 de gestion-datos-go). Sin x-ref: no tiene virtual con su
  // propio nombre, solo el virtual "activo" (localField distinto).
  asignadoA: z.string().optional(),
  tipo: TipoTrackerSchema.optional(),
  /**
   * Id del tracker fisico
   */
  uniqueId: z.string().optional(),
  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  qualcomm: QualcommDeviceSchema.optional().meta({ 'x-bson': 'mixed' }),
  t1000b: T100bDeviceSchema.optional().meta({ 'x-bson': 'mixed' }),
  telefono: TelefonoSchema.optional().meta({ 'x-bson': 'mixed' }),
  estadoCuenta: z.custom<estadoCuenta>().optional(),
  numeroAbonado: z.string().optional(),
  sim1: z.custom<ISim>().optional().meta({ 'x-bson': 'mixed' }),
  sim2: z.custom<ISim>().optional().meta({ 'x-bson': 'mixed' }),
  frecReporte: z.number().optional(),
  // Activa/desactiva remotamente el tracking GPS (solo aplica a tipo='Telefono').
  // Post-cutover (comentado/PAUSADO en el legacy archivado); sin @Prop ahí,
  // por eso sin x-bson: el meta lo castea Bool igual (drift 2026-08-04).
  trackingActivo: z.boolean().optional(),
  //
  idServiciosContratados: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ServicioContratadoSchema' }),
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
  activo: z.custom<IActivo>().optional().meta({
    'x-populate': {
      ref: 'ActivoSchema',
      localField: 'asignadoA',
      foreignField: '_id',
      justOne: true,
    },
  }),
  modelo: ModeloDispositivoSchema.optional().meta({
    'x-populate': {
      ref: 'ModeloDispositivoSchema',
      localField: 'idModelo',
      foreignField: '_id',
      justOne: true,
    },
  }),
  serviciosContratados: z.array(ServicioContratadoSchema).optional().meta({
    'x-populate': {
      ref: 'ServicioContratadoSchema',
      localField: 'idServiciosContratados',
      foreignField: '_id',
      justOne: false,
    },
  }),
}).meta({ 'x-collection': 'trackers' });

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface ITracker {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaAlta?: string;
  imagenes?: string[];
  idCliente?: string;
  idsAncestros?: string[];
  idsClientesQuePuedenAtenderEventos?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  puedeSolicitarServicioTecnico?: boolean;
  configHorariosAtencion?: IConfigHorario[];
  configHorariosAtencionTecnica?: IConfigHorario[];
  idModelo?: string;
  nombre?: string;
  identificacion?: string;
  asignadoA?: string;
  tipo?: TipoTracker;
  /**
   * Id del tracker fisico
   */
  uniqueId?: string;
  qualcomm?: IQualcommDevice;
  t1000b?: IT100bDevice;
  telefono?: ITelefono;
  estadoCuenta?: estadoCuenta;
  numeroAbonado?: string;
  sim1?: ISim;
  sim2?: ISim;
  frecReporte?: number;
  // Activa/desactiva remotamente el tracking GPS (solo aplica a tipo='Telefono').
  trackingActivo?: boolean;
  //
  idServiciosContratados?: string[];
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  activo?: IActivo;
  modelo?: IModeloDispositivo;
  serviciosContratados?: IServicioContratado[];
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados';

export const CreateTrackerSchema = TrackerSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
});
export interface ICreateTracker extends Omit<Partial<ITracker>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados';

export const UpdateTrackerSchema = TrackerSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
});
export interface IUpdateTracker extends Omit<Partial<ITracker>, OmitirUpdate> {}

export const TrackerCacheSchema = TrackerSchema.omit({
  cliente: true,
  ancestros: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
});
export interface ITrackerCache extends Omit<
  ITracker,
  'cliente' | 'ancestros' | 'activo' | 'modelo' | 'serviciosContratados'
> {}
