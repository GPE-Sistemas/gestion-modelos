import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import type {
  IDispositivoLuminariaACTIS,
  IDispositivoLuminariaCitiLight,
  IDispositivoLuminariaGPE,
  IDispositivoLuminariaWellness,
  IPerfilesDimmingACTIS,
} from './dispositivo-lorawan';

export const TipoEntidadConfigPerfilSchema = z.enum([
  'Luminaria',
  'Colectivo',
  'Activo',
  'Tracker',
  'Vehiculo',
]);
export type TipoEntidadConfigPerfil = z.infer<
  typeof TipoEntidadConfigPerfilSchema
>;

//Estos perfiles definen valores por defecto de configuraciones que tienen que tener ciertas entidades.
//Ej: en luminarias, definen configuraciones que se envían mediante comandos.
//`valores` reutiliza MapaConfigDeseada para mantenerse alineado con IConfigDeseada.

/* ────────────────────────────────────────────────
 *  PERFILES DE CONFIG POR TIPO
 *  Las luminarias ACTIS FING tienen dos tipos de perfiles: General (configuración general de la luminaria) y Dimming (configuración específica para perfiles de dimming).
 *  La configuración general contiene un idPerfilDimming que asocia  una configuración de dimming a la config general.
 * A las luminarias ACTIS se le asigna siempre una config general, que puede tener asociada una configuración de dimming.
 * ────────────────────────────────────────────────*/

export type IConfigPerfilLuminariaGPE = Omit<
  IDispositivoLuminariaGPE,
  'alarma'
>;

export type IConfigPerfilLuminariaWellness = Omit<
  IDispositivoLuminariaWellness,
  'alarma' | 'activePowerTotal' | 'reactivePowerTotal' | 'turnOnOffStatus'
>;

export type IConfigPerfilLuminariaACTISGeneral = Omit<
  IDispositivoLuminariaACTIS,
  'alarma' | 'reporteFechaHora' | 'perfilesDimming'
> & {
  idPerfilDimming?: string;
  perfilDimming?: IPerfilesDimmingACTIS;
};

export type IConfigPerfilLuminariaACTISDimming = IPerfilesDimmingACTIS;

// CitiLight: un solo tipoConfig que agrupa todos los aspectos configurables
// (systemConfig, astronomico, scheduleManual, diasEspeciales, addon). El HW no
// separa General/Dimming como ACTIS. Mismo subset que la config deseada.
export type IConfigPerfilLuminariaCitiLight = Omit<
  IDispositivoLuminariaCitiLight,
  | 'versionFirmware'
  | 'rtcStatus'
  | 'multicastStatus'
  | 'scheduleConfigStatus'
  | 'systemConfigStatus'
  | 'alarma'
>;
/* ────────────────────────────────────────────────
 *  PERFIL ÚNICO DE LUMINARIAS (tipoConfig 'Luminaria')
 *  Un solo perfil aplicable a cualquier luminaria, sea cual sea su tipo de nodo.
 *  - `comun`: lo que comparten los tipos de nodo. El backend lo traduce al
 *    formato de cada tipo al armar la config deseada.
 *  - `porTipo[tipo].propio`: lo que sólo existe en ese tipo.
 *  - `porTipo[tipo].reemplaza`: valores en el formato del dispositivo que pisan
 *    lo que saldría de `comun` para ese tipo (ej.: modo híbrido de ACTIS).
 *  Lo que no se define no se gobierna: el nodo conserva lo que tiene.
 * ────────────────────────────────────────────────*/

// 'Sin automatización' equivale a 'Manual' en GPE/Wellness y a relé en ACTIS.
export type ModoPerfilLuminaria =
  | 'Fotocélula'
  | 'Astronómico'
  | 'Sin automatización';

// Valores de período que admiten todos los tipos de nodo (minutos).
export type PeriodoReportePerfilLuminaria = 5 | 15 | 30 | 60 | 90 | 120 | 180;

export interface IPuntoCurvaDimming {
  hora: string; // 'HH:mm', hora local de la luminaria, múltiplo de 10 minutos
  porcentaje: number; // 0-100
}

// Curva de un día (0:00 a 24:00) con lazo cerrado: antes del primer punto rige
// el último. Hasta 8 puntos.
export interface ICurvaDimming {
  puntos: IPuntoCurvaDimming[];
}

export interface IConfigPerfilLuminariaComun {
  modo?: ModoPerfilLuminaria;
  husoHorario?: number; // horas respecto de UTC (ej.: -3)
  astronomico?: {
    offsetAtardecerMin?: number; // -128 a 127
    offsetAmanecerMin?: number; // -128 a 127
  };
  // Curva diaria. `porDefecto` rige cuando la curva no tiene puntos.
  dimming?: ICurvaDimming & {
    habilitado: boolean;
    porDefecto: number; // 0-100
  };
  reportes?: {
    periodoEstadoMin?: PeriodoReportePerfilLuminaria;
  };
}

export interface IConfigPerfilLuminariaPropioGPE {
  fotocelula?: {
    limLuzInferior?: number; // 1-3000
    limLuzSuperior?: number; // 1-3000
  };
  radio?: {
    adrHabilitado?: boolean;
    dataRate?: number;
  };
}

export interface IConfigPerfilLuminariaPropioACTIS {
  fotocelula?: {
    umbralSuperior?: number; // 0-255
    umbralInferior?: number; // 0-255
  };
  configACK?: IDispositivoLuminariaACTIS['configACK'];
  iniciarEncendida?: boolean; // estado al energizarse
  // Qué cambios informa el nodo además de los reportes periódicos.
  avisos?: {
    reportarEncendidoApagado?: boolean;
    reportarDimerizado?: boolean;
  };
  // Cada cuánto informa el consumo (min). Sin definir, el valor habitual: 15.
  periodoEnergiaMin?: PeriodoReportePerfilLuminaria;
  // Curvas que se suman a la diaria común. En el nodo mandan, en este orden:
  // día especial, días de la semana, diarias.
  dimmingAdicional?: {
    diaria2?: ICurvaDimming;
    diasSemana1?: ICurvaDimming & { diasSemana: boolean[] }; // [domingo..sábado]
    diasSemana2?: ICurvaDimming & { diasSemana: boolean[] };
    diasEspeciales?: (ICurvaDimming & { diaDelAnio: number })[]; // hasta 4
  };
}

export type IConfigPerfilLuminariaPropioCitiLight = Pick<
  IConfigPerfilLuminariaCitiLight,
  'systemConfig' | 'addon'
> & {
  etapasDimming?: NonNullable<
    IConfigPerfilLuminariaCitiLight['astronomico']
  >['etapasDimming'];
};

export interface IConfigPerfilLuminariaPorTipo {
  'Luminaria GPE'?: {
    propio?: IConfigPerfilLuminariaPropioGPE;
    reemplaza?: IConfigPerfilLuminariaGPE;
  };
  'Luminaria ACTIS FING'?: {
    propio?: IConfigPerfilLuminariaPropioACTIS;
    reemplaza?: Omit<IDispositivoLuminariaACTIS, 'alarma' | 'reporteFechaHora'>;
  };
  'Luminaria Wellness'?: {
    reemplaza?: IConfigPerfilLuminariaWellness;
  };
  'Luminaria CitiLight'?: {
    propio?: IConfigPerfilLuminariaPropioCitiLight;
    reemplaza?: IConfigPerfilLuminariaCitiLight;
  };
}

export interface IConfigPerfilLuminaria {
  comun?: IConfigPerfilLuminariaComun;
  porTipo?: IConfigPerfilLuminariaPorTipo;
}

// Marca de los perfiles 'Luminaria' creados a partir de perfiles por tipo.
// Mientras `pendiente` es true el perfil no se puede asignar.
export const MigracionConfigPerfilSchema = z.object({
  idsOrigen: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId' }),
  pendiente: z.boolean().optional(),
});
export type IMigracionConfigPerfil = z.infer<
  typeof MigracionConfigPerfilSchema
>;

/* ────────────────────────────────────────────────
 *  MAPA TIPO → CONFIG DESEADA
 * ────────────────────────────────────────────────*/

export type MapaConfigPerfil = {
  Luminaria: IConfigPerfilLuminaria;
  'Luminaria GPE': IConfigPerfilLuminariaGPE;
  'Luminaria Wellness': IConfigPerfilLuminariaWellness;
  'Luminaria ACTIS FING General': IConfigPerfilLuminariaACTISGeneral;
  'Luminaria ACTIS FING Dimming': IConfigPerfilLuminariaACTISDimming;
  'Luminaria CitiLight': IConfigPerfilLuminariaCitiLight;
};
/* ────────────────────────────────────────────────
 *  BASE CONFIG PERFIL (GENÉRICO)
 * ────────────────────────────────────────────────*/

export interface IConfigPerfilBase<T extends keyof MapaConfigPerfil> {
  _id?: string;
  fechaCreacion?: string;
  nombre?: string;
  global?: boolean; // Si es global, puede ser usado por cualquier cliente.

  // Tenant
  idCliente?: string;
  idsAncestros?: string[];

  // Tipo y datos
  tipoEntidad?: TipoEntidadConfigPerfil;
  tipoConfig?: T;
  valores?: MapaConfigPerfil[T];
  migracion?: IMigracionConfigPerfil;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

// Campos comunes a todas las variantes (sin tipoConfig/valores, que discriminan)
const ConfigPerfilCamposSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  nombre: z.string().optional(),
  global: z.boolean().optional(), // Si es global, puede ser usado por cualquier cliente.

  // Tenant
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

  // Tipo y datos
  tipoEntidad: TipoEntidadConfigPerfilSchema.optional(),
  migracion: MigracionConfigPerfilSchema.optional(),

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
});

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
// valores es @Prop({type: Object}) en el legacy (config-perfil/schema.ts): Mixed,
// Mongoose no castea adentro. Igual en todas las variantes.
const VarianteConfigPerfilLuminaria = ConfigPerfilCamposSchema.extend({
  tipoConfig: z.literal('Luminaria').optional(),
  valores: z
    .custom<IConfigPerfilLuminaria>()
    .optional()
    .meta({ 'x-bson': 'mixed' }),
});
const VarianteConfigPerfilLuminariaGPE =ConfigPerfilCamposSchema.extend({
  tipoConfig: z.literal('Luminaria GPE').optional(),
  valores: z
    .custom<IConfigPerfilLuminariaGPE>()
    .optional()
    .meta({ 'x-bson': 'mixed' }),
});
const VarianteConfigPerfilLuminariaWellness = ConfigPerfilCamposSchema.extend({
  tipoConfig: z.literal('Luminaria Wellness').optional(),
  valores: z
    .custom<IConfigPerfilLuminariaWellness>()
    .optional()
    .meta({ 'x-bson': 'mixed' }),
});
const VarianteConfigPerfilLuminariaACTISGeneral =
  ConfigPerfilCamposSchema.extend({
    tipoConfig: z.literal('Luminaria ACTIS FING General').optional(),
    valores: z
      .custom<IConfigPerfilLuminariaACTISGeneral>()
      .optional()
      .meta({ 'x-bson': 'mixed' }),
  });
const VarianteConfigPerfilLuminariaACTISDimming =
  ConfigPerfilCamposSchema.extend({
    tipoConfig: z.literal('Luminaria ACTIS FING Dimming').optional(),
    valores: z
      .custom<IConfigPerfilLuminariaACTISDimming>()
      .optional()
      .meta({ 'x-bson': 'mixed' }),
  });
const VarianteConfigPerfilLuminariaCitiLight = ConfigPerfilCamposSchema.extend({
  tipoConfig: z.literal('Luminaria CitiLight').optional(),
  valores: z
    .custom<IConfigPerfilLuminariaCitiLight>()
    .optional()
    .meta({ 'x-bson': 'mixed' }),
});

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export const ConfigPerfilSchema = z
  .union([
    VarianteConfigPerfilLuminaria,
    VarianteConfigPerfilLuminariaGPE,
    VarianteConfigPerfilLuminariaWellness,
    VarianteConfigPerfilLuminariaACTISGeneral,
    VarianteConfigPerfilLuminariaACTISDimming,
    VarianteConfigPerfilLuminariaCitiLight,
  ])
  .meta({ 'x-collection': 'configperfils' });

export type IConfigPerfil =
  | IConfigPerfilBase<'Luminaria'>
  | IConfigPerfilBase<'Luminaria GPE'>
  | IConfigPerfilBase<'Luminaria Wellness'>
  | IConfigPerfilBase<'Luminaria ACTIS FING General'>
  | IConfigPerfilBase<'Luminaria ACTIS FING Dimming'>
  | IConfigPerfilBase<'Luminaria CitiLight'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

const camposOmitidos: {
  _id: true;
  idsAncestros: true;
  cliente: true;
  ancestros: true;
} = {
  _id: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
};

type Omitir = '_id' | 'idsAncestros' | 'cliente' | 'ancestros';

/** Create: no incluimos virtuales/ids manejados por backend.
 *  Mantiene `tipoConfig` como discriminante.
 */
export const CreateConfigPerfilSchema = z.union([
  VarianteConfigPerfilLuminaria.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaGPE.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaWellness.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaACTISGeneral.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaACTISDimming.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaCitiLight.omit(camposOmitidos),
]);
export type ICreateConfigPerfil =
  | Omit<IConfigPerfilBase<'Luminaria'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria GPE'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria Wellness'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria ACTIS FING General'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria ACTIS FING Dimming'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria CitiLight'>, Omitir>;

/** Update: campos parciales pero `tipoConfig` se mantiene para discriminar.
 *  TS valida que `valores` corresponda al `tipoConfig`.
 */
export const UpdateConfigPerfilSchema = z.union([
  VarianteConfigPerfilLuminaria.omit(camposOmitidos).required({
    tipoConfig: true,
  }),
  VarianteConfigPerfilLuminariaGPE.omit(camposOmitidos).required({
    tipoConfig: true,
  }),
  VarianteConfigPerfilLuminariaWellness.omit(camposOmitidos).required({
    tipoConfig: true,
  }),
  VarianteConfigPerfilLuminariaACTISGeneral.omit(camposOmitidos).required({
    tipoConfig: true,
  }),
  VarianteConfigPerfilLuminariaACTISDimming.omit(camposOmitidos).required({
    tipoConfig: true,
  }),
  VarianteConfigPerfilLuminariaCitiLight.omit(camposOmitidos).required({
    tipoConfig: true,
  }),
]);
export type IUpdateConfigPerfil =
  | ({ tipoConfig: 'Luminaria' } & Partial<
      Omit<IConfigPerfilBase<'Luminaria'>, Omitir | 'tipoConfig'>
    >)
  | ({ tipoConfig: 'Luminaria GPE' } & Partial<
      Omit<IConfigPerfilBase<'Luminaria GPE'>, Omitir | 'tipoConfig'>
    >)
  | ({ tipoConfig: 'Luminaria Wellness' } & Partial<
      Omit<IConfigPerfilBase<'Luminaria Wellness'>, Omitir | 'tipoConfig'>
    >)
  | ({ tipoConfig: 'Luminaria ACTIS FING General' } & Partial<
      Omit<
        IConfigPerfilBase<'Luminaria ACTIS FING General'>,
        Omitir | 'tipoConfig'
      >
    >)
  | ({ tipoConfig: 'Luminaria ACTIS FING Dimming' } & Partial<
      Omit<
        IConfigPerfilBase<'Luminaria ACTIS FING Dimming'>,
        Omitir | 'tipoConfig'
      >
    >)
  | ({ tipoConfig: 'Luminaria CitiLight' } & Partial<
      Omit<IConfigPerfilBase<'Luminaria CitiLight'>, Omitir | 'tipoConfig'>
    >);
