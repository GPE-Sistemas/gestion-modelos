import { ICliente } from './cliente';
import {
  IDispositivoLuminariaACTIS,
  IDispositivoLuminariaGPE,
  IDispositivoLuminariaWellness,
  IPerfilesDimmingACTIS,
} from './dispositivo-lorawan';

export type TipoEntidadConfigPerfil =
  | 'Luminaria'
  | 'Colectivo'
  | 'Activo'
  | 'Tracker'
  | 'Vehiculo';

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

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export type IConfigPerfil =
  | IConfigPerfilBase<'Luminaria GPE'>
  | IConfigPerfilBase<'Luminaria Wellness'>
  | IConfigPerfilBase<'Luminaria ACTIS FING General'>
  | IConfigPerfilBase<'Luminaria ACTIS FING Dimming'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

type Omitir = '_id' | 'idsAncestros' | 'cliente' | 'ancestros';

/** Create: no incluimos virtuales/ids manejados por backend.
 *  Mantiene `tipoConfig` como discriminante.
 */
export type ICreateConfigPerfil =
  | Omit<IConfigPerfilBase<'Luminaria GPE'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria Wellness'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria ACTIS FING General'>, Omitir>
  | Omit<IConfigPerfilBase<'Luminaria ACTIS FING Dimming'>, Omitir>;

/** Update: campos parciales pero `tipoConfig` se mantiene para discriminar.
 *  TS valida que `valores` corresponda al `tipoConfig`.
 */
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
