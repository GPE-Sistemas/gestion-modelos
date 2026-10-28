import { z } from 'zod';
import type { IActivo } from './activo';
import {
  ClienteSchema,
  ConfigHorarioSchema,
  ICliente,
  IConfigHorario,
} from './cliente';
import type { estadoCuenta } from './estado-entidad';
import { ISim, SimSchema } from './sim';
import {
  IModeloDispositivo,
  ModeloDispositivoSchema,
} from './modelo-dispositivo';
import {
  IServicioContratado,
  ServicioContratadoSchema,
} from './servicio-contratado';

// Dashcam: cámara vehicular con módem 4G que habla JT/T 808 (posición y
// alarmas ADAS/DSM, perfil "JT808_Jiangsu Province Standard") y JT/T 1078
// (video). Entidad aparte del tracker, asociable a un activo igual que él:
// `activo.idDashcam` ↔ `dashcam.asignadoA`. Un activo puede tener tracker y
// dashcam a la vez.

// Función de cada canal de video. La G40 Pro trae 2 cámaras (CH1 frontal,
// CH2 cabina) y admite 3 externas (CH3–CH5).
export const FuncionCanalDashcamSchema = z.enum([
  'Frontal',
  'Cabina',
  'Trasera',
  'Lateral',
  'Carga',
  'Otra',
]);
export type FuncionCanalDashcam = z.infer<typeof FuncionCanalDashcamSchema>;

export const CanalDashcamSchema = z.object({
  /** Número de canal lógico JT/T 1078 (1–5 en la G40 Pro). */
  numero: z.number().optional(),
  nombre: z.string().optional(),
  funcion: FuncionCanalDashcamSchema.optional(),
  /** Si se ofrece en "Ver en vivo" y en la búsqueda de grabaciones. */
  habilitado: z.boolean().optional(),
  /** Si el canal tiene audio (en la G40 Pro, sólo el CH1 interno). */
  audio: z.boolean().optional(),
});
export type ICanalDashcam = z.infer<typeof CanalDashcamSchema>;

// Lo que el equipo informa de sí mismo al registrarse (JT/T 808 0x0100) y al
// autenticarse (0x0102, versión 2019). Lo escribe gestion-trackers-go; el
// formulario lo muestra pero no lo edita.
export const EquipoDashcamSchema = z.object({
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  idTerminal: z.string().optional(),
  imei: z.string().optional(),
  versionFirmware: z.string().optional(),
  /** '2013' o '2019' según el bit 14 de los atributos de la cabecera JT/T 808. */
  versionProtocolo: z.string().optional(),
  fechaRegistro: z.string().optional().meta({ 'x-bson': 'date' }),
});
export type IEquipoDashcam = z.infer<typeof EquipoDashcamSchema>;

export const FlujoVideoDashcamSchema = z.enum(['Principal', 'Secundario']);
export type FlujoVideoDashcam = z.infer<typeof FlujoVideoDashcamSchema>;

// Ajustes de video del lado de IRIX (no se envían al equipo).
export const ConfigVideoDashcamSchema = z.object({
  /** Flujo para "Ver en vivo": el secundario consume mucho menos 4G. */
  flujoEnVivo: FlujoVideoDashcamSchema.optional(),
  /** Corte automático de la transmisión en vivo, en segundos. */
  duracionMaximaEnVivo: z.number().optional(),
  /** Pedir automáticamente la evidencia (0x9208) de cada alarma que la anuncie. */
  solicitarEvidencia: z.boolean().optional(),
});
export type IConfigVideoDashcam = z.infer<typeof ConfigVideoDashcamSchema>;

// Populates intra-SCC como z.custom (import type-only), igual que tracker.ts.
// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const DashcamSchema = z
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
    /**
     * Identificador JT/T 808 del equipo: el "teléfono" de la cabecera (en la
     * app de la G40: "SIM CardNumber"), SIN ceros a la izquierda.
     */
    uniqueId: z.string().optional(),
    /** Número de serie impreso en el equipo (Device Information). */
    numeroSerie: z.string().optional(),
    asignadoA: z.string().optional(),
    canales: z.array(CanalDashcamSchema).optional(),
    configVideo: ConfigVideoDashcamSchema.optional(),
    // SIN x-bson: sub-schema real, para que los updates parciales de
    // gestion-trackers-go (equipo.versionFirmware, …) no pisen el sub-documento
    // entero. Mismo criterio que tracker.t1000b.
    equipo: EquipoDashcamSchema.optional(),
    /**
     * Minutos respecto de UTC de las horas BCD que manda el equipo. Si falta,
     * 480 (GMT+8, lo que dice JT/T 808). Se confirma en las pruebas de campo.
     */
    husoHorarioEquipo: z.number().optional(),

    estadoCuenta: z.custom<estadoCuenta>().optional(),
    numeroAbonado: z.string().optional(),
    idSim1: z.string().optional().meta({ 'x-bson': 'objectId' }),
    idSim2: z.string().optional().meta({ 'x-bson': 'objectId' }),
    /** Intervalo de reporte esperado, en MINUTOS (igual que tracker.frecReporte: lo usan el estado de conexión y el control de "sin reportar"). */
    frecReporte: z.number().optional(),
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
  .meta({ 'x-collection': 'dashcams' });

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface IDashcam {
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
  /**
   * Identificador JT/T 808 del equipo ("SIM CardNumber"), sin ceros a la izquierda.
   */
  uniqueId?: string;
  numeroSerie?: string;
  asignadoA?: string;
  canales?: ICanalDashcam[];
  configVideo?: IConfigVideoDashcam;
  equipo?: IEquipoDashcam;
  husoHorarioEquipo?: number;
  estadoCuenta?: estadoCuenta;
  numeroAbonado?: string;
  idSim1?: string;
  idSim2?: string;
  frecReporte?: number;
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
  | 'ancestros'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados'
  | 'sim1'
  | 'sim2';

export const CreateDashcamSchema = DashcamSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
  sim1: true,
  sim2: true,
});
export interface ICreateDashcam extends Omit<Partial<IDashcam>, OmitirCreate> {}

type OmitirUpdate = OmitirCreate;

export const UpdateDashcamSchema = DashcamSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
  sim1: true,
  sim2: true,
});
export interface IUpdateDashcam extends Omit<Partial<IDashcam>, OmitirUpdate> {}

export const DashcamCacheSchema = DashcamSchema.omit({
  cliente: true,
  ancestros: true,
  activo: true,
  modelo: true,
  serviciosContratados: true,
  sim1: true,
  sim2: true,
});
export interface IDashcamCache extends Omit<
  IDashcam,
  | 'cliente'
  | 'ancestros'
  | 'activo'
  | 'modelo'
  | 'serviciosContratados'
  | 'sim1'
  | 'sim2'
> {}
