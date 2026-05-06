import { ICliente } from './cliente';
import { MapaConfigDeseada } from './config-deseada';

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
 *  BASE CONFIG PERFIL (GENÉRICO)
 * ────────────────────────────────────────────────*/

export interface IConfigPerfilBase<T extends keyof MapaConfigDeseada> {
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
  valores?: MapaConfigDeseada[T];

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
  | IConfigPerfilBase<'Luminaria ACTIS FING'>;

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
  | Omit<IConfigPerfilBase<'Luminaria ACTIS FING'>, Omitir>;

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
  | ({ tipoConfig: 'Luminaria ACTIS FING' } & Partial<
      Omit<IConfigPerfilBase<'Luminaria ACTIS FING'>, Omitir | 'tipoConfig'>
    >);
