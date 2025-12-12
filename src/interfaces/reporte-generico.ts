// reporte-generico.ts
import { IGeoJSONPoint } from '../auxiliares';
import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IDispositivoLorawan } from './dispositivo-lorawan';
import { IGrupo } from './grupo';
import { ILuminaria } from './luminaria';
import { IRecorrido } from './recorrido';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type TipoTriangulacion = 'GNSS' | 'Wifi';

export type ModoForzado =
  | 'No Forzado'
  | 'Forzado Encendido'
  | 'Forzado Apagado';

export type IModoLuminaria =
  | 'Indeterminado'
  | 'Fotocélula'
  | 'Calendario'
  | 'Manual';

/* ────────────────────────────────────────────────
 *  TIPOS BASE
 * ────────────────────────────────────────────────*/

export type TipoValoresReporte =
  | 'Luminaria GPE Periódico'
  | 'Luminaria GPE Energía'
  | 'Luminaria Wellness'
  | 'Luminaria ACTIS FING Estado'
  | 'Luminaria ACTIS FING Energía'
  | 'Tracker 4G'
  | 'Tracker T1000B'
  | 'Tracker Qualcomm';
export type TipoEntidadReporte =
  | 'Luminaria'
  | 'Colectivo'
  | 'Activo'
  | 'Tracker'
  | 'Vehiculo';

/* ────────────────────────────────────────────────
 *  REPORTES POR TIPO
 * ────────────────────────────────────────────────*/

export interface IReporteLuminariaGPE {
  turnOnOffStatus?: boolean;
  modo?: IModoLuminaria;
  estadoRele?: boolean;
  dimmerHabilitado?: boolean;
  energiaExterna?: boolean;
  potencia?: number;
  voltaje?: number;
  dimmingValue?: number;
  fCnt?: number;
  alarmas?: string[];
  esDeDia?: boolean;
  horaAmanecer?: string;
  horaAtardecer?: string;
  tiempoEncendida?: number; // En horas
}

export interface IReporteLuminariaGPEEnergia {
  corriente?: number;
  voltaje?: number;
  potencia?: number;
  energia?: number;
  energiaTotal?: number;
  factorPotencia?: number;
  fCnt?: number;
  esDeDia?: boolean;
  horaAmanecer?: string;
  horaAtardecer?: string;
}

export interface IReporteLuminariaWellness {
  dimmingValue?: number;
  turnOnOffStatus?: boolean;
  voltage?: number;
  current?: number;
  activePower?: number;
  reactivePower?: number;
  activePowerTotal?: number;
  reactivePowerTotal?: number;
  temperature?: number;
  lumenes?: number;
  modo?: IModoLuminaria;
  modoForzado?: ModoForzado;
}

// ===== ACTIS FING =====
// Reporte de estado (Puerto 131: 1 byte - encendido/apagado, motivo, nivel dimming)
export interface IReporteLuminariaACTISEstado {
  turnOnOffStatus?: boolean;
  modo?: IModoLuminaria;
  estadoRele?: boolean;
  dimmingValue?: number;
  fCnt?: number;
  esDeDia?: boolean;
  horaAmanecer?: string;
  horaAtardecer?: string;
  tiempoEncendida?: number; // En horas
}

// Reporte de energía (Puerto 130: 3 bytes - voltaje delta, corriente, factor de potencia)
export interface IReporteLuminariaACTISEnergia {
  corriente?: number;
  voltaje?: number;
  potencia?: number;
  factorPotencia?: number;
  fCnt?: number;
  esDeDia?: boolean;
  horaAmanecer?: string;
  horaAtardecer?: string;
  alarmas?: string[];
  energiaTotal?: number; // kWh acumulado total calculado por integración temporal
}

export interface IReporteTracker {
  fechaDevice?: string;
  geojson?: IGeoJSONPoint;
  snappedGeojson?: IGeoJSONPoint;
  direccion?: string;
  velocidad?: number;
  orientacion?: number;
  ignicion?: boolean;
}

export interface IReporteTracker4G extends IReporteTracker {
  traccarUniqueId?: string;
  odometro?: number;
}

export interface IReporteTrackerT1000B extends IReporteTracker {
  devEui?: string;
  bateria?: number;
  tipoTriangulacion?: TipoTriangulacion;
}

export interface IReporteTrackerQualcomm extends IReporteTracker {
  bateria?: number;
  tipoTriangulacion?: TipoTriangulacion;
}

/* ────────────────────────────────────────────────
 *  MAPA DE TIPOS DE REPORTE → DATOS
 * ────────────────────────────────────────────────*/

export type MapaValoresReporte = {
  'Luminaria GPE Periódico': IReporteLuminariaGPE;
  'Luminaria GPE Energía': IReporteLuminariaGPEEnergia;
  'Luminaria Wellness': IReporteLuminariaWellness;
  'Luminaria ACTIS FING Estado': IReporteLuminariaACTISEstado;
  'Luminaria ACTIS FING Energía': IReporteLuminariaACTISEnergia;
  'Tracker 4G': IReporteTracker4G;
  'Tracker T1000B': IReporteTrackerT1000B;
  'Tracker Qualcomm': IReporteTrackerQualcomm;
};

/* ────────────────────────────────────────────────
 *  TIPO VALORES REUTILIZABLE
 * ────────────────────────────────────────────────*/

export type ValoresReporte<T extends keyof MapaValoresReporte> = {
  timestamp?: string;
} & MapaValoresReporte[T];

/* ────────────────────────────────────────────────
 *  BASE DEL REPORTE (GENÉRICO)
 * ────────────────────────────────────────────────*/

export interface IReporteBase<T extends keyof MapaValoresReporte> {
  _id?: string;
  fechaCreacion?: string;
  expireAt?: string;

  // Tenant / relaciones
  idCliente?: string;
  idsAncestros?: string[];
  idEntidad?: string;
  idsAsignados?: string[];

  // Tipo y datos
  tipoEntidad?: TipoEntidadReporte;
  tipoReporte?: T;
  valores?: ValoresReporte<T>;

  // Populate opcional
  cliente?: ICliente;
  ancestros?: ICliente[];
  dispositivoLora?: IDispositivoLorawan;
  tracker?: ITracker;
  grupos?: IGrupo[];
  activo?: IActivo;
  recorrido?: IRecorrido;
  usuario?: IUsuario;
  luminaria?: ILuminaria;
}

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export type IReporteGenerico =
  | IReporteBase<'Luminaria GPE Periódico'>
  | IReporteBase<'Luminaria GPE Energía'>
  | IReporteBase<'Luminaria Wellness'>
  | IReporteBase<'Luminaria ACTIS FING Estado'>
  | IReporteBase<'Luminaria ACTIS FING Energía'>
  | IReporteBase<'Tracker 4G'>
  | IReporteBase<'Tracker T1000B'>
  | IReporteBase<'Tracker Qualcomm'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

type Omitir =
  | '_id'
  | 'idsAncestros'
  | 'cliente'
  | 'ancestros'
  | 'dispositivoLora'
  | 'tracker'
  | 'grupos'
  | 'activo'
  | 'recorrido'
  | 'usuario'
  | 'luminaria';

/** Create: no incluimos los virtuales/ids que manejás en el backend.
 *  Mantiene `tipoReporte` como discriminante.
 */
export type ICreateReporteGenerico =
  | Omit<IReporteBase<'Luminaria GPE Periódico'>, Omitir>
  | Omit<IReporteBase<'Luminaria GPE Energía'>, Omitir>
  | Omit<IReporteBase<'Luminaria Wellness'>, Omitir>
  | Omit<IReporteBase<'Luminaria ACTIS FING Estado'>, Omitir>
  | Omit<IReporteBase<'Luminaria ACTIS FING Energía'>, Omitir>
  | Omit<IReporteBase<'Tracker 4G'>, Omitir>
  | Omit<IReporteBase<'Tracker T1000B'>, Omitir>
  | Omit<IReporteBase<'Tracker Qualcomm'>, Omitir>;

/** Update: permitimos campos parciales (opcional) pero mantenemos `tipoReporte` para que TS pueda discriminar.
 *  Ejemplo: cuando actualizás, podés enviar solo `valores` con algunos campos o metadatos.
 */
export type IUpdateReporteGenerico =
  | ({ tipoReporte: 'Luminaria GPE Periódico' } & Partial<
      Omit<IReporteBase<'Luminaria GPE Periódico'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Luminaria GPE Energía' } & Partial<
      Omit<IReporteBase<'Luminaria GPE Energía'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Luminaria Wellness' } & Partial<
      Omit<IReporteBase<'Luminaria Wellness'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Luminaria ACTIS FING Estado' } & Partial<
      Omit<IReporteBase<'Luminaria ACTIS FING Estado'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Luminaria ACTIS FING Energía' } & Partial<
      Omit<IReporteBase<'Luminaria ACTIS FING Energía'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker 4G' } & Partial<
      Omit<IReporteBase<'Tracker 4G'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker T1000B' } & Partial<
      Omit<IReporteBase<'Tracker T1000B'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker Qualcomm' } & Partial<
      Omit<IReporteBase<'Tracker Qualcomm'>, Omitir | 'tipoReporte'>
    >);
