import { ICliente } from './cliente';
import {
  IDispositivoLorawan,
  IDispositivoLuminariaACTIS,
  IDispositivoLuminariaGPE,
  IDispositivoLuminariaWellness,
} from './dispositivo-lorawan';

export type Estado = 'Coincide' | 'No coincide';

/* ────────────────────────────────────────────────
 *  CONFIGS DESEADAS POR TIPO (Tienen correlación con las configuraciones REALES de los dispositivos para hacer comparaciones)
 *  (subset de MapaConfigDispositivo: se excluyen
 *   alarma, reporteFechaHora, activePowerTotal,
 *   reactivePowerTotal, turnOnOffStatus)
 * ────────────────────────────────────────────────*/

export type IConfigDeseadaLuminariaGPE = Omit<
  IDispositivoLuminariaGPE,
  'alarma'
>;

export type IConfigDeseadaLuminariaWellness = Omit<
  IDispositivoLuminariaWellness,
  'alarma' | 'activePowerTotal' | 'reactivePowerTotal' | 'turnOnOffStatus'
>;

export type IConfigDeseadaLuminariaACTIS = Omit<
  IDispositivoLuminariaACTIS,
  'alarma' | 'reporteFechaHora'
>;

/* ────────────────────────────────────────────────
 *  MAPA TIPO → CONFIG DESEADA
 * ────────────────────────────────────────────────*/

export type MapaConfigDeseada = {
  'Luminaria GPE': IConfigDeseadaLuminariaGPE;
  'Luminaria Wellness': IConfigDeseadaLuminariaWellness;
  'Luminaria ACTIS FING': IConfigDeseadaLuminariaACTIS;
};

/* ────────────────────────────────────────────────
 *  BASE CONFIG DESEADA (GENÉRICO)
 * ────────────────────────────────────────────────*/

export interface IConfigDeseadaBase<T extends keyof MapaConfigDeseada> {
  // Info autogenerada
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];

  // Discriminante
  tipo?: T;

  // Info de carga
  fechaCreacion?: string; // Default: Date.now
  fechaAplicacion?: string;
  idEntidad?: string;
  config?: MapaConfigDeseada[T];
  estado?: Estado;

  // Virtuals
  dispositivo?: IDispositivoLorawan;
  cliente?: ICliente;
  ancestros?: ICliente[];
}

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export type IConfigDeseada =
  | IConfigDeseadaBase<'Luminaria GPE'>
  | IConfigDeseadaBase<'Luminaria Wellness'>
  | IConfigDeseadaBase<'Luminaria ACTIS FING'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

type Omitir =
  | '_id'
  | 'idsAncestros'
  | 'fechaCreacion'
  | 'dispositivo'
  | 'cliente'
  | 'ancestros';

/** Create: no incluimos virtuales/ids manejados por backend.
 *  Mantiene `tipo` como discriminante.
 */
export type ICreateConfigDispositivo =
  | Omit<IConfigDeseadaBase<'Luminaria GPE'>, Omitir>
  | Omit<IConfigDeseadaBase<'Luminaria Wellness'>, Omitir>
  | Omit<IConfigDeseadaBase<'Luminaria ACTIS FING'>, Omitir>;

/** Update: campos parciales pero `tipo` se mantiene para discriminar.
 *  TS valida que `config` corresponda al `tipo`.
 */
export type IUpdateConfigDispositivo =
  | ({ tipo: 'Luminaria GPE' } & Partial<
      Omit<IConfigDeseadaBase<'Luminaria GPE'>, Omitir | 'tipo'>
    >)
  | ({ tipo: 'Luminaria Wellness' } & Partial<
      Omit<IConfigDeseadaBase<'Luminaria Wellness'>, Omitir | 'tipo'>
    >)
  | ({ tipo: 'Luminaria ACTIS FING' } & Partial<
      Omit<IConfigDeseadaBase<'Luminaria ACTIS FING'>, Omitir | 'tipo'>
    >);
