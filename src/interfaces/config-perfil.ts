import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import type {
  IDispositivoLuminariaACTIS,
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
/* ────────────────────────────────────────────────
 *  MAPA TIPO → CONFIG DESEADA
 * ────────────────────────────────────────────────*/

export type MapaConfigPerfil = {
  'Luminaria GPE': IConfigPerfilLuminariaGPE;
  'Luminaria Wellness': IConfigPerfilLuminariaWellness;
  'Luminaria ACTIS FING General': IConfigPerfilLuminariaACTISGeneral;
  'Luminaria ACTIS FING Dimming': IConfigPerfilLuminariaACTISDimming;
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

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

// Campos comunes a todas las variantes (sin tipoConfig/valores, que discriminan)
const ConfigPerfilCamposSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  nombre: z.string().optional(),
  global: z.boolean().optional(), // Si es global, puede ser usado por cualquier cliente.

  // Tenant
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),

  // Tipo y datos
  tipoEntidad: TipoEntidadConfigPerfilSchema.optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
const VarianteConfigPerfilLuminariaGPE = ConfigPerfilCamposSchema.extend({
  tipoConfig: z.literal('Luminaria GPE').optional(),
  valores: z.custom<IConfigPerfilLuminariaGPE>().optional(),
});
const VarianteConfigPerfilLuminariaWellness = ConfigPerfilCamposSchema.extend({
  tipoConfig: z.literal('Luminaria Wellness').optional(),
  valores: z.custom<IConfigPerfilLuminariaWellness>().optional(),
});
const VarianteConfigPerfilLuminariaACTISGeneral =
  ConfigPerfilCamposSchema.extend({
    tipoConfig: z.literal('Luminaria ACTIS FING General').optional(),
    valores: z.custom<IConfigPerfilLuminariaACTISGeneral>().optional(),
  });
const VarianteConfigPerfilLuminariaACTISDimming =
  ConfigPerfilCamposSchema.extend({
    tipoConfig: z.literal('Luminaria ACTIS FING Dimming').optional(),
    valores: z.custom<IConfigPerfilLuminariaACTISDimming>().optional(),
  });

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export const ConfigPerfilSchema = z.union([
  VarianteConfigPerfilLuminariaGPE,
  VarianteConfigPerfilLuminariaWellness,
  VarianteConfigPerfilLuminariaACTISGeneral,
  VarianteConfigPerfilLuminariaACTISDimming,
]);

export type IConfigPerfil =
  | IConfigPerfilBase<'Luminaria GPE'>
  | IConfigPerfilBase<'Luminaria Wellness'>
  | IConfigPerfilBase<'Luminaria ACTIS FING General'>
  | IConfigPerfilBase<'Luminaria ACTIS FING Dimming'>;

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
  VarianteConfigPerfilLuminariaGPE.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaWellness.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaACTISGeneral.omit(camposOmitidos),
  VarianteConfigPerfilLuminariaACTISDimming.omit(camposOmitidos),
]);
export type ICreateConfigPerfil =
  | Omit<IConfigPerfilBase<'Luminaria GPE'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria Wellness'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria ACTIS FING General'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria ACTIS FING Dimming'>, Omitir>;

/** Update: campos parciales pero `tipoConfig` se mantiene para discriminar.
 *  TS valida que `valores` corresponda al `tipoConfig`.
 */
export const UpdateConfigPerfilSchema = z.union([
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
]);
export type IUpdateConfigPerfil =
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
    >);
