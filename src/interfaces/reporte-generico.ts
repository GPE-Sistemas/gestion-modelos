// reporte-generico.ts
import { IGeoJSONPoint } from '../auxiliares';
import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IDispositivoLorawan } from './dispositivo-lorawan';
import { IGrupo } from './grupo';
import { ILuminaria } from './luminaria';
import { IRecorrido } from './recorrido';
import { TipoTriangulacion } from './reporte';
import { IModoLuminaria, ModoForzado } from './reporte-dispositivo';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

/* ────────────────────────────────────────────────
 *  TIPOS BASE
 * ────────────────────────────────────────────────*/

export type TipoValoresReporte =
  | 'Luminaria GPE Periódico'
  | 'Luminaria GPE Energía'
  | 'Luminaria Wellness'
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

export interface IReporteTracker {
  fechaDevice?: string;
  geojson?: IGeoJSONPoint;
  velocidad?: number;
  orientacion?: number;
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

type MapaValoresReporte = {
  'Luminaria GPE Periódico': IReporteLuminariaGPE;
  'Luminaria GPE Energía': IReporteLuminariaGPEEnergia;
  'Luminaria Wellness': IReporteLuminariaWellness;
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
  | ({ tipoReporte: 'Tracker 4G' } & Partial<
      Omit<IReporteBase<'Tracker 4G'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker T1000B' } & Partial<
      Omit<IReporteBase<'Tracker T1000B'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker Qualcomm' } & Partial<
      Omit<IReporteBase<'Tracker Qualcomm'>, Omitir | 'tipoReporte'>
    >);
