import { IGeoJSONPoint } from '../auxiliares';
import { ICliente } from './cliente';
import {
  IDispositivoLorawan,
  IDispositivoLuminariaACTIS,
  IDispositivoLuminariaGPE,
  IDispositivoLuminariaWellness,
  IModosACTIS,
  IPerfilesDimmingACTIS,
} from './dispositivo-lorawan';

// 'Pendiente' indica creada/modificada pero aún no comparada por el reconciliador.
export type Estado = 'Coincide' | 'No coincide' | 'Pendiente';

/* ────────────────────────────────────────────────
 *  CONFIGS DESEADAS POR TIPO (Tienen correlación con las configuraciones REALES de los dispositivos para hacer comparaciones)
 *  (subset de MapaConfigDispositivo: se excluyen
 *   alarma, reporteFechaHora, activePowerTotal,
 *   reactivePowerTotal, turnOnOffStatus, versiones de firmware, etc. — son campos no configurables)
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
  'alarma' | 'reporteFechaHora' | 'versionFirmware' | 'versionModuloLoRa'
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
 *  DIFFS DE RECONCILIACIÓN
 * ────────────────────────────────────────────────*/

// Cada diff identifica un campo que no coincide entre la config deseada y la
// real del dispositivo. El reconciliador lo usa para resolver qué downlink
// disparar y qué get encadenar para refrescar dispositivo.config tras el set.
export interface IDiffConfig {
  campo: string; // dot path (ej: "fotocelula.umbralSuperior")
  esperado: unknown;
  real: unknown;
  puertoDownlink: number; // puerto del set corrector
  puertoGet?: number; // puerto del get que refresca dispositivo.config (ACTIS)
}

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
  | 'fechaActualizacion'
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
