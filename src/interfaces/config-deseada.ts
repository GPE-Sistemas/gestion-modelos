import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import {
  DispositivoLuminariaACTISSchema,
  DispositivoLuminariaCitiLightSchema,
  DispositivoLuminariaGPESchema,
  DispositivoLuminariaWellnessSchema,
  IDispositivoLorawan,
  IDispositivoLuminariaACTIS,
  IDispositivoLuminariaCitiLight,
  IDispositivoLuminariaGPE,
  IDispositivoLuminariaWellness,
} from './dispositivo-lorawan';

// 'Pendiente' indica creada/modificada pero aún no comparada por el reconciliador.
export const EstadoSchema = z.enum(['Coincide', 'No coincide', 'Pendiente']);
export type Estado = z.infer<typeof EstadoSchema>;

/* ────────────────────────────────────────────────
 *  CONFIGS DESEADAS POR TIPO (Tienen correlación con las configuraciones REALES de los dispositivos para hacer comparaciones)
 *  (subset de MapaConfigDispositivo: se excluyen
 *   alarma, reporteFechaHora, activePowerTotal,
 *   reactivePowerTotal, turnOnOffStatus, versiones de firmware, etc. — son campos no configurables)
 * ────────────────────────────────────────────────*/

export const ConfigDeseadaLuminariaGPESchema =
  DispositivoLuminariaGPESchema.omit({ alarma: true });
export type IConfigDeseadaLuminariaGPE = Omit<
  IDispositivoLuminariaGPE,
  'alarma'
>;

export const ConfigDeseadaLuminariaWellnessSchema =
  DispositivoLuminariaWellnessSchema.omit({
    alarma: true,
    activePowerTotal: true,
    reactivePowerTotal: true,
    turnOnOffStatus: true,
  });
export type IConfigDeseadaLuminariaWellness = Omit<
  IDispositivoLuminariaWellness,
  'alarma' | 'activePowerTotal' | 'reactivePowerTotal' | 'turnOnOffStatus'
>;

export const ConfigDeseadaLuminariaACTISSchema =
  DispositivoLuminariaACTISSchema.omit({
    alarma: true,
    reporteFechaHora: true,
    versionFirmware: true,
    versionModuloLoRa: true,
  });
export type IConfigDeseadaLuminariaACTIS = Omit<
  IDispositivoLuminariaACTIS,
  'alarma' | 'reporteFechaHora' | 'versionFirmware' | 'versionModuloLoRa'
>;

// CitiLight: solo los aspectos configurables (systemConfig, astronomico,
// scheduleManual, diasEspeciales, addon). Se excluye todo lo reflejado de uplinks.
const camposNoConfigurablesCitiLight = {
  versionFirmware: true,
  rtcStatus: true,
  multicastStatus: true,
  scheduleConfigStatus: true,
  systemConfigStatus: true,
  alarma: true,
} as const;
export const ConfigDeseadaLuminariaCitiLightSchema =
  DispositivoLuminariaCitiLightSchema.omit(camposNoConfigurablesCitiLight);
export type IConfigDeseadaLuminariaCitiLight = Omit<
  IDispositivoLuminariaCitiLight,
  | 'versionFirmware'
  | 'rtcStatus'
  | 'multicastStatus'
  | 'scheduleConfigStatus'
  | 'systemConfigStatus'
  | 'alarma'
>;

/* ────────────────────────────────────────────────
 *  MAPA TIPO → CONFIG DESEADA
 * ────────────────────────────────────────────────*/

export type MapaConfigDeseada = {
  'Luminaria GPE': IConfigDeseadaLuminariaGPE;
  'Luminaria Wellness': IConfigDeseadaLuminariaWellness;
  'Luminaria ACTIS FING': IConfigDeseadaLuminariaACTIS;
  'Luminaria CitiLight': IConfigDeseadaLuminariaCitiLight;
};

/* ────────────────────────────────────────────────
 *  DIFFS DE RECONCILIACIÓN
 * ────────────────────────────────────────────────*/

// Cada diff identifica un campo que no coincide entre la config deseada y la
// real del dispositivo. El reconciliador lo usa para resolver qué downlink
// disparar y qué get encadenar para refrescar dispositivo.config tras el set.
export const DiffConfigSchema = z.object({
  campo: z.string(), // dot path (ej: "fotocelula.umbralSuperior")
  esperado: z.unknown(),
  real: z.unknown(),
  puertoDownlink: z.number(), // puerto del set corrector
  puertoGet: z.number().optional(), // puerto del get que refresca dispositivo.config (ACTIS)
});
export type IDiffConfig = z.infer<typeof DiffConfigSchema>;

/* ────────────────────────────────────────────────
 *  BASE CONFIG DESEADA (GENÉRICO)
 * ────────────────────────────────────────────────*/

// Interface genérica hand-written (no hay z.infer genérico): los schemas se
// construyen por variante más abajo y se unen con z.union.
export interface IConfigDeseadaBase<T extends keyof MapaConfigDeseada> {
  // Info autogenerada
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];

  // Discriminante
  tipo?: T;

  // Info de carga
  fechaCreacion?: string; // Default: Date.now
  fechaActualizacion?: string; // Última vez que cambió el contenido de la configuración deseada
  fechaAplicacion?: string;
  idEntidad?: string;
  config?: MapaConfigDeseada[T];
  estado?: Estado;

  // Reconciliación (escritos por el cron reconciliador)
  diffs?: IDiffConfig[]; // campos en discrepancia tras la última comparación
  ultimaComparacion?: string; // ISO timestamp de la última comparación realizada por el reconciliador
  ultimaReconciliacion?: string; // ISO timestamp del último set disparado
  reintentosReconciliacion?: number; // counter para back-off
  bloqueadoHasta?: string; // ISO. Si > now no se reintenta (circuit breaker)
  divergenteDesde?: string; // ISO. Instante de la PRIMERA detección 'No coincide' (se limpia al converger). Mide el tiempo-a-convergencia.

  // Virtuals
  dispositivo?: IDispositivoLorawan;
  cliente?: ICliente;
  ancestros?: ICliente[];
}

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts. `x-collection` va en el z.union() de
// ConfigDeseadaSchema más abajo (una sola colección para las 3 variantes).
const ConfigDeseadaCamposSchema = z.object({
  // Info autogenerada
  _id: z.string().optional(),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

  // Info de carga
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }), // Default: Date.now
  fechaActualizacion: z.string().optional().meta({ 'x-bson': 'date' }), // Última vez que cambió el contenido de la configuración deseada
  fechaAplicacion: z.string().optional().meta({ 'x-bson': 'date' }),
  // String plano (unique sparse — ver comentario de configdeseadas/meta.go
  // en gestion-datos-go): sin x-bson. Se popula bajo el nombre "dispositivo"
  // (virtual con nombre distinto al path) matcheando contra
  // dispositivolorawans._id.
  idEntidad: z.string().optional(),
  estado: EstadoSchema.optional(),

  // Reconciliación (escritos por el cron reconciliador)
  // @Prop({type:[Object], default: undefined}): Mixed, Mongoose no lo
  // materializa como [] (exento en arraysQueNoSonArrays del drift test).
  diffs: z.array(DiffConfigSchema).optional().meta({ 'x-bson': 'mixed' }), // campos en discrepancia tras la última comparación
  ultimaComparacion: z.string().optional().meta({ 'x-bson': 'date' }), // ISO timestamp de la última comparación realizada por el reconciliador
  ultimaReconciliacion: z.string().optional().meta({ 'x-bson': 'date' }), // ISO timestamp del último set disparado
  reintentosReconciliacion: z.number().optional(), // counter para back-off
  bloqueadoHasta: z.string().optional().meta({ 'x-bson': 'date' }), // ISO. Si > now no se reintenta (circuit breaker)

  // Virtuals
  // z.custom para no arrastrar el shape completo del dispositivo al
  // declaration emit (TS7056 en ConfigDeseadaSchema).
  dispositivo: z.custom<IDispositivoLorawan>().optional().meta({
    'x-populate': {
      ref: 'DispositivoLorawanSchema',
      localField: 'idEntidad',
      foreignField: '_id',
      justOne: true,
    },
  }),
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
});

const VarianteConfigDeseadaGPE = ConfigDeseadaCamposSchema.extend({
  // Discriminante
  tipo: z.literal('Luminaria GPE').optional(),
  config: ConfigDeseadaLuminariaGPESchema.optional(),
});
const VarianteConfigDeseadaWellness = ConfigDeseadaCamposSchema.extend({
  // Discriminante
  tipo: z.literal('Luminaria Wellness').optional(),
  config: ConfigDeseadaLuminariaWellnessSchema.optional(),
});
const VarianteConfigDeseadaACTIS = ConfigDeseadaCamposSchema.extend({
  // Discriminante
  tipo: z.literal('Luminaria ACTIS FING').optional(),
  config: ConfigDeseadaLuminariaACTISSchema.optional(),
});
const VarianteConfigDeseadaCitiLight = ConfigDeseadaCamposSchema.extend({
  // Discriminante
  tipo: z.literal('Luminaria CitiLight').optional(),
  config: ConfigDeseadaLuminariaCitiLightSchema.optional(),
});

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export const ConfigDeseadaSchema = z
  .union([
    VarianteConfigDeseadaGPE,
    VarianteConfigDeseadaWellness,
    VarianteConfigDeseadaACTIS,
    VarianteConfigDeseadaCitiLight,
  ])
  .meta({ 'x-collection': 'configdeseadas' });

export type IConfigDeseada =
  | IConfigDeseadaBase<'Luminaria GPE'>
  | IConfigDeseadaBase<'Luminaria Wellness'>
  | IConfigDeseadaBase<'Luminaria ACTIS FING'>
  | IConfigDeseadaBase<'Luminaria CitiLight'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

type Omitir =
  | '_id'
  | 'idsAncestros'
  | 'fechaCreacion'
  | 'fechaActualizacion'
  | 'dispositivo'
  | 'cliente'
  | 'ancestros';

const camposOmitidos: {
  _id: true;
  idsAncestros: true;
  fechaCreacion: true;
  fechaActualizacion: true;
  dispositivo: true;
  cliente: true;
  ancestros: true;
} = {
  _id: true,
  idsAncestros: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  dispositivo: true,
  cliente: true,
  ancestros: true,
};

/** Create: no incluimos virtuales/ids manejados por backend.
 *  Mantiene `tipo` como discriminante.
 */
export const CreateConfigDispositivoSchema = z.union([
  VarianteConfigDeseadaGPE.omit(camposOmitidos),
  VarianteConfigDeseadaWellness.omit(camposOmitidos),
  VarianteConfigDeseadaACTIS.omit(camposOmitidos),
  VarianteConfigDeseadaCitiLight.omit(camposOmitidos),
]);

export type ICreateConfigDispositivo =
  | Omit<IConfigDeseadaBase<'Luminaria GPE'>, Omitir>
  | Omit<IConfigDeseadaBase<'Luminaria Wellness'>, Omitir>
  | Omit<IConfigDeseadaBase<'Luminaria ACTIS FING'>, Omitir>
  | Omit<IConfigDeseadaBase<'Luminaria CitiLight'>, Omitir>;

/** Update: campos parciales pero `tipo` se mantiene para discriminar.
 *  TS valida que `config` corresponda al `tipo`.
 */
export const UpdateConfigDispositivoSchema = z.union([
  VarianteConfigDeseadaGPE.omit(camposOmitidos).extend({
    tipo: z.literal('Luminaria GPE'),
  }),
  VarianteConfigDeseadaWellness.omit(camposOmitidos).extend({
    tipo: z.literal('Luminaria Wellness'),
  }),
  VarianteConfigDeseadaACTIS.omit(camposOmitidos).extend({
    tipo: z.literal('Luminaria ACTIS FING'),
  }),
  VarianteConfigDeseadaCitiLight.omit(camposOmitidos).extend({
    tipo: z.literal('Luminaria CitiLight'),
  }),
]);

export type IUpdateConfigDispositivo =
  | ({ tipo: 'Luminaria GPE' } & Partial<
      Omit<IConfigDeseadaBase<'Luminaria GPE'>, Omitir | 'tipo'>
    >)
  | ({ tipo: 'Luminaria Wellness' } & Partial<
      Omit<IConfigDeseadaBase<'Luminaria Wellness'>, Omitir | 'tipo'>
    >)
  | ({ tipo: 'Luminaria ACTIS FING' } & Partial<
      Omit<IConfigDeseadaBase<'Luminaria ACTIS FING'>, Omitir | 'tipo'>
    >)
  | ({ tipo: 'Luminaria CitiLight' } & Partial<
      Omit<IConfigDeseadaBase<'Luminaria CitiLight'>, Omitir | 'tipo'>
    >);
