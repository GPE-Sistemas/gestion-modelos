import { IGeoJSONPoint } from '../auxiliares';
import { ICliente } from './cliente';
import { IComando } from './comando';
import { IModeloDispositivo } from './modelo-dispositivo';
import { IModoLuminaria, IReporteGenerico } from './reporte-generico';

/* ────────────────────────────────────────────────
 *  TIPOS, PAYLOADS E INTERFACES
 * ────────────────────────────────────────────────*/

export type TipoDispositivoLorawan =
  | 'Luminaria GPE'
  | 'Luminaria Wellness'
  | 'Luminaria ACTIS FING';

//Las luminarias ACTIS pueden tener más de un modo de funcionamiento en simultáneo (ej: astronómico + fotocélula para el encendido).
export interface IModosACTIS {
  fotocelula?: boolean;
  astronomico?: boolean;
  manual?: boolean;
  rele?: boolean;
}
//Notas: En el caso de estos dispositivos:
// Potencia de dispositivo GPE = consumo instantáneo (W)
// Energía de dispositivo GPE = Reactive Power de dispositivo Wellness = Consumo acumulado (kWh)
//Esta es la estructura de la config de un dispositivoGPE. A partir de sus valores se va a generar un payload para cambiar la configuración del dispositivo

export interface IConfigGeneralGPE {
  //Llegan con cada reporte de estado
  mode?: IModoLuminaria;
  estadoRele?: boolean;
  dimmerHabilitado?: boolean;
  energiaExterna?: boolean;
  adrHabilitado?: boolean;

  //Datos de configuración (llegan al inicio del firmware o por pedido de downlink)
  limLuzInferior?: number;
  limLuzSuperior?: number;
  offsetGPSAmanecer?: number;
  offsetGPSAtardecer?: number;
  timeZone?: number;
  frecReporte?: number;
  dataRate?: number;
}
// ===== MODO ACTIS (Puerto 10) =====
//Uplinks asociados:
// puerto 10 (si se consulta con downlink al puerto 15, devuelve el modo actual configurado)
// puerto 131 (llega de manera periódica o se puede consultar por puerto 42, indica con qué modo se apagó/encendió una luminaria)
//Downlinks asociados:
//puerto 11 (encendido manual, con opción de salir por fotocélula o reloj astronómico)
//puerto 15 (se puede consultar la configuración de modo)
//puerto 42 (consulta el estado de la luminaria)
export interface PayloadSetModeActis {
  modoFotocelula?: {
    encendidoHabilitado?: boolean; // bit0
    apagadoHabilitado?: boolean; // bit1
  };
  modoRelojAstronomico?: {
    encendidoHabilitado?: boolean; // bit2
    apagadoHabilitado?: boolean; // bit3
  };
  iniciarEncendida?: boolean; // bit4 - Estado inicial al salir de modo manual
  modoRele?: boolean; //Es un flag que se incluye para generar el comando que se enviará a Chirpstack
}

// ===== PAYLOAD MODO MANUAL ACTIS (Puerto 11) =====
//Uplinks asociados:
// puerto 10 (si se consulta con downlink al puerto 15, devuelve el modo de la luminaria)
//puerto 131 (llega de manera periódica o se puede consultar por puerto 42, indica si la luminaria está encendida o apagada y en qué modo se apagó/encendió una luminaria)
// Downlinks asociados:
//puerto 10 (cambia el modo de la luminaria)
export interface PayloadSetManualActis {
  estadoManual?: {
    nivelDimming?: number; // 0-31 (31 = 100%)
    encendido?: boolean;
    salirPorFotocelula?: boolean;
    salirPorRelojAstronomico?: boolean;
  };
}

// ===== PAYLOAD GET STATE ACTIS (Puerto 42) =====
//Uplinks asociados:
// puerto 131 (info de estado)
//puerto 130 (reporte energía)
//puerto 120 (sensado de la fotocélula)
//puerto 121 (reporte fecha/hora)
//Cada bit del byte enviado solicita un reporte distinto del controlador.
export interface PayloadGetStateActis {
  reporteEnergia?: boolean; // bit0 - puerto 130
  reporteEstado?: boolean; // bit1 - puerto 131
  fotocelula?: boolean; // bit2 - puerto 120
  fechaHora?: boolean; // bit3 - puerto 121
}

// ===== PAYLOAD GET CONFIG ACTIS (Puerto 15) =====
//Uplinks asociados:
// puerto 10 (setMode)
// puerto 12 (setOffset - reloj astronómico)
// puerto 13 (setThreshold - umbrales fotocélula)
// puerto 14 (setCoordinates)
//Cada bit del byte enviado al puerto 15 solicita la configuración correspondiente.
export interface PayloadGetConfigActis {
  setMode?: boolean; // bit0 - puerto 10
  setOffset?: boolean; // bit1 - puerto 12
  setThreshold?: boolean; // bit2 - puerto 13
  setCoordinates?: boolean; // bit3 - puerto 14
}

// ===== PAYLOAD GET CONFIG GENERAL ACTIS (Puerto 45) =====
//Uplinks asociados:
// puerto 110 (versión FW microcontrolador)
// puerto 111 (versión FW módulo XDot)
// puerto 43  (configuración de reportes -> setReportConfig)
// puerto 44  (configuración de ACKs    -> setACKConfig)
//Cada bit del byte enviado solicita un parámetro distinto de la configuración general.
export interface PayloadGetConfigGeneralActis {
  versionFirmwareMCU?: boolean; // bit0 - puerto 110
  versionFirmwareXDot?: boolean; // bit1 - puerto 111
  configReportes?: boolean; // bit2 - puerto 43 (setReportConfig)
  configACK?: boolean; // bit3 - puerto 44 (setACKConfig)
}

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

export interface IPaquetesDispositivoLorawan {
  inicioSesion?: Date; //Cuando inició la sesión actual del dispositivo
  fCntInicial?: number; // fCnt inicial (normalmente 0, 1 o 2)
  ultimoFcnt?: number; // Último fCnt recibido
  framesRecibidos?: number; //Cantidad de frames recibidos
  perdidaPaquetes?: number; // Porcentaje de pérdida de paquetes
}

// Último gateway que captó el dispositivo. Se actualiza en cada uplink (o cada
// cierto TTL, en lora-luminarias) eligiendo el de mejor SNR (relación señal/ruido). Lo usa el orchestrator de downlinks (en el Cron)
// para hacer throttling por gateway (airtime compartido).

export interface IUltimoGateway {
  gatewayEui?: string;
  rssi?: number;
  snr?: number;
  fechaCaptura?: string; // ISO timestamp
}

// Rastreo del cron de consulta de configuración inicial (gestion-cron). Una
// luminaria cuyo dispositivo nunca tuvo perfil ni SET manual nunca recibe un
// `get`, por lo que `config` queda vacía. Ese cron envía los GET pertinentes
// (origen 'ConsultaConfig') para hacer el bootstrap de la config real. Este
// sub-doc evita bucles infinitos en dispositivos que no responden: cuenta los
// intentos sin respuesta y bloquea temporalmente (circuit breaker) tras superar
// el máximo.
export interface IConsultaConfigDispositivo {
  intentos?: number; // ciclos consultados sin que la config se complete
  ultimaConsulta?: string; // ISO — última vez que se enviaron los gets
  bloqueadoHasta?: string; // ISO — circuit breaker, no se consulta hasta que expire
}

/* ────────────────────────────────────────────────
 *  CONFIGURACIONES DE DISPOSITIVOS
 * ────────────────────────────────────────────────*/

// Union type para config (retrocompatibilidad - ahora se usa MapaConfigDispositivo)
export type IDispositivoLuminariaConfig =
  | IDispositivoLuminariaGPE
  | IDispositivoLuminariaWellness
  | IDispositivoLuminariaACTIS;

export interface IDispositivoLuminariaGPE {
  configGeneral?: IConfigGeneralGPE;
  configCalendario?: IDimmerCalendarioConfig;
  alarma?: string;
}

//⚠️⚠️⚠️⚠️⚠️ No deberían haber datos energéticos en las configuraciones de los dispositivos. Peor bueno, son Wellness y ni se usan
export interface IDispositivoLuminariaWellness {
  mode?: IModoLuminaria;
  activePowerTotal?: number; // kWh - acumulada (A pesar de que digen power, realmente son energía)
  reactivePowerTotal?: number; // kWh - acumulada
  turnOnOffStatus?: boolean; // True: Encendido, False: Apagado
  alarma?: string;
}

// Configuración para dispositivos ACTIS FING
export interface IDispositivoLuminariaACTIS {
  // ===== MODOS (Puerto 10 consultado por 15 / modo manual por 11 / reporte por 131) =====
  modoEncendido?: IModosACTIS;
  modoApagado?: IModosACTIS;
  iniciarEncendida?: boolean;

  // ===== COORDENADAS GPS (Puerto 14 consultado por 15) =====
  coordenadas?: {
    geojson?: IGeoJSONPoint;
    timeZone?: number; // UTC offset en horas
  };

  // ===== FOTOCÉLULA (Puerto 13 consultado por 15) =====
  fotocelula?: {
    umbralSuperior?: number; // 0-255 (0-3.3V)
    umbralInferior?: number; // 0-255
    promedio?: number; // Puerto 120: promedio último minuto (0-255)
  };

  // ===== RELOJ ASTRONÓMICO (Puerto 12 consultado por 15) =====
  relojAstronomico?: {
    offsetAtardecer?: number; // -128 a 127 minutos
    offsetAmanecer?: number; // -128 a 127 minutos
  };

  // ===== CONFIG REPORTES (Puerto 43 consultado por 45, reportes 130/131) =====
  configReportes?: {
    reportarEncendidoApagado?: boolean; // bit0
    reportarDimerizado?: boolean; // bit1
    periodoEstado?: 0 | 5 | 15 | 30 | 60 | 90 | 120 | 180; // bits 2-4 (min)
    periodoEnergia?: 0 | 5 | 15 | 30 | 60 | 90 | 120 | 180; // bits 5-7 (min)
  };

  // ===== CONFIG ACK (Puerto 44 consultado por 45) =====
  configACK?: {
    periodoHoras?: number; // bits 0-4 (0-31 horas)
    forzado?: boolean; // bit5: envía mensaje vacío al expirar timer
    ackEstado?: boolean; // bit6
    ackEnergia?: boolean; // bit7
  };

  // ===== PERFILES DIMERIZADO (Puertos 20-30) =====
  perfilesDimming?: IPerfilesDimmingACTIS;

  // ===== FIRMWARE =====
  versionFirmware?: string; // Puerto 110
  versionModuloLoRa?: string; // Puerto 111

  // ===== ALARMAS =====
  alarma?: string;

  // ===== FECHA/HORA (Puerto 121) =====
  reporteFechaHora?: {
    reportada?: string; // timestamp del dispositivo
    receivedAt?: string; // timestamp de recepción API
  };
}

/* ────────────────────────────────────────────────
 *  MAPA DE TIPO → CONFIG (TYPE-SAFE)
 * ────────────────────────────────────────────────*/
//Estas son las configs reales de los dispositivos, las cuales se obtienen por uplinks
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
  tiempoLimiteComunicacion?: number; // Tiempo máximo sin reportar (en horas) antes de generar evento "Sin comunicación".

  ubicacion?: IGeoJSONPoint; // GeoJSON de la ubicacion del dispositivo
  ultimoComando?: IComando; //Último downlink enviado a este dispositivo
  paquetes?: IPaquetesDispositivoLorawan; //Información para calcular la pérdida de paquetes
  ultimoGateway?: IUltimoGateway; //Gateway con mejor señal en el último uplink capturado
  consultaConfig?: IConsultaConfigDispositivo; //Rastreo del cron de consulta de configuración inicial (bootstrap de config).

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
