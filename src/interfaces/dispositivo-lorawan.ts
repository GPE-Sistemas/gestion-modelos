import { IGeoJSONPoint } from '../auxiliares';
import { ICliente } from './cliente';
import { IComando } from './comando';
import { IModeloDispositivo } from './modelo-dispositivo';
import { IModoLuminaria, IReporteGenerico } from './reporte-generico';

//Notas: En el caso de estos dispositivos:
// Potencia de dispositivo GPE = consumo instantáneo (W)
// Energía de dispositivo GPE = Reactive Power de dispositivo Wellness = Consumo acumulado (kWh)
//Esta es la estructura de la config de un dispositivoGPE. A partir de sus valores se va a generar un payload para cambiar la configuración del dispositivo
export interface IConfigDispositivoGPEPayload {
  //Config byte
  mode?: IModoLuminaria;
  estadoRele?: boolean;
  dimmerHabilitado?: boolean;
  energiaExterna?: boolean;
  adrHabilitado?: boolean;

  //Otros
  limLuzInferior?: number;
  limLuzSuperior?: number;
  offsetGPSAmanecer?: number;
  offsetGPSAtardecer?: number;
  timeZone?: number;
  frecReporte?: number;
  dataRate?: number;
}

export interface IPaquetesDispositivoLorawan {
  inicioSesion?: Date; //Cuando inició la sesión actual del dispositivo
  fCntInicial?: number; // fCnt inicial (normalmente 0, 1 o 2)
  ultimoFcnt?: number; // Último fCnt recibido
  framesRecibidos?: number; //Cantidad de frames recibidos
  perdidaPaquetes?: number; // Porcentaje de pérdida de paquetes
}
export interface IConfigDispositivoLuminaria {
  // TODO: Definir los tipos de las propiedades cuando sean conocidos
  [key: string]: any;
}

// Union type para config (retrocompatibilidad - ahora se usa MapaConfigDispositivo)
export type IDispositivoLuminariaConfig =
  | IDispositivoLuminariaGPE
  | IDispositivoLuminariaWellness
  | IDispositivoLuminariaACTIS;

//Si se trata de una luminaria Wellness, esta es la info que se va a cargar en la config del dispositivo
export interface IDispositivoLuminariaGPE {
  //Datos de configuración (llegan al inicio del firmware o por pedido de downlink)
  limLuzInferior?: number;
  limLuzSuperior?: number;
  offsetGPSAmanecer?: number;
  offsetGPSAtardecer?: number;
  timeZone?: number;
  frecReporte?: number;
  dataRate?: number;

  //Datos de estado (llegan cada 10 minutos)
  mode?: IModoLuminaria;
  estadoRele?: boolean;
  dimmerHabilitado?: boolean;
  energiaExterna?: boolean;
  adrHabilitado?: boolean;
  alarma?: string;

  //Datos de consumo (llegan cada 1 hora)
  corriente?: number; //mA
  voltaje?: number; //V
  potencia?: number; //W
  energia?: number; //kWh
  energiaTotal?: number; //kWh
  factorPotencia?: number;

  //Configuración modo calendario
  configCalendario?: IDimmerCalendarioConfig;
}
export interface IDispositivoLuminariaWellness {
  mode?: IModoLuminaria;
  activePowerTotal?: number; // kWh - acumulada (A pesar de que digen power, realmente son energía)
  reactivePowerTotal?: number; // kWh - acumulada
  turnOnOffStatus?: boolean; // True: Encendido, False: Apagado
  alarma?: string;
}

// ===== ACTIS FING =====

// Estructura de perfiles de dimerizado para ACTIS FING
export interface ICambioDimmingACTIS {
  offsetMinutos?: number; // -720 a 720 desde medianoche
  nivelDimming?: number; // 0-31
}

export interface IPerfilDiasSeleccionados {
  diasSemana?: boolean[]; // [domingo, lunes, ..., sábado]
  cambios?: ICambioDimmingACTIS[];
}

export interface IPerfilDiaEspecial {
  diaDelAnio?: number; // 1-366
  cambios?: ICambioDimmingACTIS[];
}

export interface IPerfilesDimmingACTIS {
  dimDefault?: number; // 0-31
  perfilesHabilitados?: number; // Byte con flags

  // 2 perfiles "Todos los días"
  perfilTodosLosDias1?: ICambioDimmingACTIS[];
  perfilTodosLosDias2?: ICambioDimmingACTIS[];

  // 2 perfiles "Días seleccionados"
  perfilDiasSemana1?: IPerfilDiasSeleccionados;
  perfilDiasSemana2?: IPerfilDiasSeleccionados;

  // 4 perfiles "Días especiales"
  perfilDiaEspecial1?: IPerfilDiaEspecial;
  perfilDiaEspecial2?: IPerfilDiaEspecial;
  perfilDiaEspecial3?: IPerfilDiaEspecial;
  perfilDiaEspecial4?: IPerfilDiaEspecial;
}

// Configuración para dispositivos ACTIS FING
export interface IDispositivoLuminariaACTIS {
  // ===== MODOS DE FUNCIONAMIENTO (Puerto 10) =====
  modoFotocelula?: {
    encendidoHabilitado?: boolean; // bit0
    apagadoHabilitado?: boolean; // bit1
  };
  modoRelojAstronomico?: {
    encendidoHabilitado?: boolean; // bit2
    apagadoHabilitado?: boolean; // bit3
  };
  iniciarEncendida?: boolean; // bit4 - Estado inicial al salir de modo manual

  // ===== COORDENADAS GPS (Puerto 14) =====
  coordenadas?: {
    latitud?: number; // float
    longitud?: number; // float
    timeZone?: number; // UTC offset en horas
  };

  // ===== FOTOCÉLULA (Puerto 13) =====
  fotocelula?: {
    umbralSuperior?: number; // 0-255 (corresponde a 0-3.3V)
    umbralInferior?: number; // 0-255
  };

  // ===== RELOJ ASTRONÓMICO (Puerto 12) =====
  relojAstronomico?: {
    offsetAtardecer?: number; // -128 a 127 minutos
    offsetAmanecer?: number; // -128 a 127 minutos
  };

  // ===== ESTADO MANUAL (Puerto 11) =====
  estadoManual?: {
    nivelDimming?: number; // 0-31 (31 = 100%)
    encendido?: boolean;
    salirPorFotocelula?: boolean;
    salirPorRelojAstronomico?: boolean;
  };

  // ===== CONFIGURACIÓN DE REPORTES (Puerto 43) =====
  configReportes?: {
    reportarEncendidoApagado?: boolean; // bit0
    reportarDimerizado?: boolean; // bit1
    periodoEstado?: 0 | 5 | 15 | 30 | 60 | 90 | 120 | 180; // bits 2-4 (minutos)
    periodoConsumo?: 0 | 5 | 15 | 30 | 60 | 90 | 120 | 180; // bits 5-7 (minutos)
  };

  // ===== PERFILES DE DIMERIZADO (Puertos 20-30) =====
  perfilesDimming?: IPerfilesDimmingACTIS;

  // ===== VERSIONES FIRMWARE =====
  versionFirmware?: string; // Puerto 110
  versionModuloLoRa?: string; // Puerto 111

  // ===== ALARMAS=====
  alarma?: string;
  // =====FRECUENCIA DE REPORTES=====
  frecReportePeriodico?: number;
  frecReporteEnergia?: number;

  // ===== CONSUMO ACUMULADO =====
  // Energía total acumulada calculada por integración temporal (kWh)
  energiaTotal?: number;
  // Último reporte de energía para cálculo diferencial
  ultimoReporteEnergia?: {
    timestamp?: string;
    voltaje?: number; // V
    corriente?: number; // mA
    potencia?: number; // W
    factorPotencia?: number;
    fCnt?: number;
  };
}

export type TipoDispositivoLorawan =
  | 'Luminaria GPE'
  | 'Luminaria Wellness'
  | 'Luminaria ACTIS FING';

/* ────────────────────────────────────────────────
 *  MAPA DE TIPO → CONFIG (TYPE-SAFE)
 * ────────────────────────────────────────────────*/

export type MapaConfigDispositivo = {
  'Luminaria GPE': IDispositivoLuminariaGPE;
  'Luminaria Wellness': IDispositivoLuminariaWellness;
  'Luminaria ACTIS FING': IDispositivoLuminariaACTIS;
};

/* ────────────────────────────────────────────────
 *  BASE DEL DISPOSITIVO (GENÉRICO)
 * ────────────────────────────────────────────────*/

export interface IDispositivoLorawanBase<
  T extends keyof MapaConfigDispositivo,
> {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idModeloDispositivo?: string;
  fechaCreacion?: string;

  // ===== DISCRIMINATED UNION =====
  tipo?: T;
  config?: MapaConfigDispositivo[T];

  // Campos comunes
  fechaUltimaComunicacion?: string;
  ultimoReporte?: IReporteGenerico;
  margin?: number; //Es la señal del dispositivo, expresada en dB
  frecReporte?: number;
  //En Wellness es 15 minutos, en GPE y ACTIS se considera la frecuencia de reporte periódico
  ubicacion?: IGeoJSONPoint; // GeoJSON de la ubicacion del dispositivo
  ultimoComando?: IComando; //Último downlink enviado a este dispositivo
  paquetes?: IPaquetesDispositivoLorawan; //Información para calcular la pérdida de paquetes

  // Datos para el lora server
  deveui?: string;
  joineui?: string;
  description?: string;
  name?: string;
  tags?: Record<string, string>;
  applicationId?: string;
  deviceProfileId?: string;
  variables?: Record<string, string>;
  isDisabled?: boolean;
  skipFcntCheck?: boolean;

  // Datos para OTAA
  appkey?: string; //Con esta se completa tanto el appKey y el nwkKey para deviceKeys

  //Datos para ABP
  devAddr?: string;
  appSKey?: string;
  fCntUp?: number;
  nFCntDown?: number;
  nwkskey?: string; //Con esta se completa fNwkSIntKey, nwkSEncKey y sNwkSIntKey para activationKeys

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  modeloDispositivo?: IModeloDispositivo;
}

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export type IDispositivoLorawan =
  | IDispositivoLorawanBase<'Luminaria GPE'>
  | IDispositivoLorawanBase<'Luminaria Wellness'>
  | IDispositivoLorawanBase<'Luminaria ACTIS FING'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

type OmitirCreate = '_id' | 'cliente' | 'ancestros' | 'modeloDispositivo';

/** Create: no incluimos los virtuales/ids que manejás en el backend.
 *  Mantiene `tipo` como discriminante para type safety.
 */
export type ICreateDispositivoLorawan =
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria GPE'>>, OmitirCreate>
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria Wellness'>>, OmitirCreate>
  | Omit<
      Partial<IDispositivoLorawanBase<'Luminaria ACTIS FING'>>,
      OmitirCreate
    >;

type OmitirUpdate = '_id' | 'cliente' | 'ancestros' | 'modeloDispositivo';

/** Update: permitimos campos parciales pero mantenemos `tipo` para que TS pueda discriminar.
 *  Cuando actualizás config, TypeScript valida que sea del tipo correcto según `tipo`.
 */
export type IUpdateDispositivoLorawan =
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria GPE'>>, OmitirUpdate>
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria Wellness'>>, OmitirUpdate>
  | Omit<
      Partial<IDispositivoLorawanBase<'Luminaria ACTIS FING'>>,
      OmitirUpdate
    >;

//Información para el modo calendario
export interface IDimmerCalendarioConfig {
  calendarioHabilitado: boolean;
  puntos: IPuntoDimmer[];
  porcentajeDefecto: number;
}
//Información para cada punto del modo calendario
export interface IPuntoDimmer {
  hora: string;
  porcentaje: number;
  activo: boolean;
}
