import { z } from 'zod';
import type { IActivo } from './activo';
import {
  ClienteSchema,
  ConfigHorarioSchema,
  ICliente,
  IConfigHorario,
} from './cliente';
import type { estadoCuenta } from './estado-entidad';
import {
  PaquetesDispositivoLorawanSchema,
  UltimoGatewaySchema,
} from './dispositivo-lorawan';
import { ISim, SimSchema } from './sim';
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
  // ── Provisioning en el Network Server (ChirpStack) ───────────────────────
  deveui: z.string().optional().meta({ 'x-setter': 'uppercase' }),
  joineui: z.string().optional(),
  /** OTAA: con esta se completan appKey y nwkKey en deviceKeys. */
  appkey: z.string().optional(),
  applicationId: z.string().optional(),
  deviceProfileId: z.string().optional(),
  isDisabled: z.boolean().optional(),
  skipFcntCheck: z.boolean().optional(),
  tags: z.record(z.string(), z.string()).optional().meta({ 'x-bson': 'mixed' }),
  variables: z
    .record(z.string(), z.string())
    .optional()
    .meta({ 'x-bson': 'mixed' }),
  // ── Telemetría de radio ───────────
  fechaUltimaComunicacion: z.string().optional().meta({ 'x-bson': 'date' }),
  /** Horas sin reportar antes de generar el evento "Sin comunicación". */
  tiempoLimiteComunicacion: z.number().optional(),
  /** Señal del dispositivo, expresada en dB. */
  margin: z.number().optional(),
  /** Información para calcular la pérdida de paquetes. */
  paquetes: PaquetesDispositivoLorawanSchema.optional().meta({
    'x-bson': 'mixed',
  }),
  /** Gateway con mejor señal en el último uplink capturado. */
  ultimoGateway: UltimoGatewaySchema.optional().meta({ 'x-bson': 'mixed' }),
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
export const TrackerSchema = z
  .object({
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
    // SIN x-bson: sub-schema REAL, para que sus paths casteen y para que los
    // updates parciales no pisen el sub-documento entero. Ver T100bDeviceSchema.
    t1000b: T100bDeviceSchema.optional(),
    telefono: TelefonoSchema.optional().meta({ 'x-bson': 'mixed' }),

    estadoCuenta: z.custom<estadoCuenta>().optional(),
    numeroAbonado: z.string().optional(),
    // FK plana a `sims` (cast objectId para filtros). El populate va por los
    // virtuals nombrados sim1/sim2 (x-populate), NO in-place — mismo patrón que
    // `comunicador` y que la SIM de seguridad. Por eso SIN x-ref.
    idSim1: z.string().optional().meta({ 'x-bson': 'objectId' }),
    idSim2: z.string().optional().meta({ 'x-bson': 'objectId' }),
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
    ancestros: z
      .array(ClienteSchema)
      .optional()
      .meta({
        'x-populate': {
          ref: 'ClienteSchema',
          localField: 'idsAncestros',
          foreignField: '_id',
          justOne: false,
        },
      }),
    activo: z
      .custom<IActivo>()
      .optional()
      .meta({
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
    serviciosContratados: z
      .array(ServicioContratadoSchema)
      .optional()
      .meta({
        'x-populate': {
          ref: 'ServicioContratadoSchema',
          localField: 'idServiciosContratados',
          foreignField: '_id',
          justOne: false,
        },
      }),
    sim1: SimSchema.optional().meta({
      'x-populate': {
        ref: 'SimSchema',
        localField: 'idSim1',
        foreignField: '_id',
        justOne: true,
      },
    }),
    sim2: SimSchema.optional().meta({
      'x-populate': {
        ref: 'SimSchema',
        localField: 'idSim2',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'trackers' });

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
  idSim1?: string;
  idSim2?: string;
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
  sim1?: ISim;
  sim2?: ISim;
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados'
  | 'sim1'
  | 'sim2';

export const CreateTrackerSchema = TrackerSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
  sim1: true,
  sim2: true,
});
export interface ICreateTracker extends Omit<Partial<ITracker>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados'
  | 'sim1'
  | 'sim2';

export const UpdateTrackerSchema = TrackerSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
  sim1: true,
  sim2: true,
});
export interface IUpdateTracker extends Omit<Partial<ITracker>, OmitirUpdate> {}

export const TrackerCacheSchema = TrackerSchema.omit({
  cliente: true,
  ancestros: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
  sim1: true,
  sim2: true,
});
export interface ITrackerCache extends Omit<
  ITracker,
  | 'cliente'
  | 'ancestros'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados'
  | 'sim1'
  | 'sim2'
> {}
