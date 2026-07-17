import { z } from 'zod';
import { GeoJSONPointSchema, IGeoJSONPoint } from '../auxiliares';
import { ClienteSchema, ICliente } from './cliente';
import type { IComando } from './comando';
import {
  IModeloDispositivo,
  ModeloDispositivoSchema,
} from './modelo-dispositivo';
import type { IModoLuminaria, IReporteGenerico } from './reporte-generico';

/* ────────────────────────────────────────────────
 *  TIPOS, PAYLOADS E INTERFACES
 * ────────────────────────────────────────────────*/

export const TipoDispositivoLorawanSchema = z.enum([
  'Luminaria GPE',
  'Luminaria Wellness',
  'Luminaria ACTIS FING',
]);
export type TipoDispositivoLorawan = z.infer<
  typeof TipoDispositivoLorawanSchema
>;

//Las luminarias ACTIS pueden tener más de un modo de funcionamiento en simultáneo (ej: astronómico + fotocélula para el encendido).
export const ModosACTISSchema = z.object({
  fotocelula: z.boolean().optional(),
  astronomico: z.boolean().optional(),
});
export type IModosACTIS = z.infer<typeof ModosACTISSchema>;

//Notas: En el caso de estos dispositivos:
// Potencia de dispositivo GPE = consumo instantáneo (W)
// Energía de dispositivo GPE = Reactive Power de dispositivo Wellness = Consumo acumulado (kWh)
//Esta es la estructura de la config de un dispositivoGPE. A partir de sus valores se va a generar un payload para cambiar la configuración del dispositivo

// Populates/referencias intra-SCC como z.custom (import type-only): un schema
// real acá arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const ConfigGeneralGPESchema = z.object({
  //Llegan con cada reporte de estado
  mode: z.custom<IModoLuminaria>().optional(),
  estadoRele: z.boolean().optional(),
  dimmerHabilitado: z.boolean().optional(),
  energiaExterna: z.boolean().optional(),
  adrHabilitado: z.boolean().optional(),

  //Datos de configuración (llegan al inicio del firmware o por pedido de downlink)
  limLuzInferior: z.number().optional(),
  limLuzSuperior: z.number().optional(),
  offsetGPSAmanecer: z.number().optional(),
  offsetGPSAtardecer: z.number().optional(),
  timeZone: z.number().optional(),
  frecReporte: z.number().optional(),
  dataRate: z.number().optional(),
});
export type IConfigGeneralGPE = z.infer<typeof ConfigGeneralGPESchema>;

// ===== MODO ACTIS (Puerto 10) =====
//Uplinks asociados:
// puerto 10 (si se consulta con downlink al puerto 15, devuelve el modo actual configurado)
// puerto 131 (llega de manera periódica o se puede consultar por puerto 42, indica con qué modo se apagó/encendió una luminaria)
//Downlinks asociados:
//puerto 11 (encendido manual, con opción de salir por fotocélula o reloj astronómico)
//puerto 15 (se puede consultar la configuración de modo)
//puerto 42 (consulta el estado de la luminaria)
export const PayloadSetModeActisSchema = z.object({
  modoFotocelula: z
    .object({
      encendidoHabilitado: z.boolean().optional(), // bit0
      apagadoHabilitado: z.boolean().optional(), // bit1
    })
    .optional(),
  modoRelojAstronomico: z
    .object({
      encendidoHabilitado: z.boolean().optional(), // bit2
      apagadoHabilitado: z.boolean().optional(), // bit3
    })
    .optional(),
  iniciarEncendida: z.boolean().optional(), // bit4 - Estado inicial al salir de modo manual
});
export type PayloadSetModeActis = z.infer<typeof PayloadSetModeActisSchema>;

// ===== PAYLOAD MODO MANUAL ACTIS (Puerto 11) =====
//Uplinks asociados:
// puerto 10 (si se consulta con downlink al puerto 15, devuelve el modo de la luminaria)
//puerto 131 (llega de manera periódica o se puede consultar por puerto 42, indica si la luminaria está encendida o apagada y en qué modo se apagó/encendió una luminaria)
// Downlinks asociados:
//puerto 10 (cambia el modo de la luminaria)
export const PayloadSetManualActisSchema = z.object({
  estadoManual: z
    .object({
      nivelDimming: z.number().optional(), // 0-31 (31 = 100%)
      encendido: z.boolean().optional(),
      salirPorFotocelula: z.boolean().optional(),
      salirPorRelojAstronomico: z.boolean().optional(),
    })
    .optional(),
});
export type PayloadSetManualActis = z.infer<typeof PayloadSetManualActisSchema>;

// ===== PAYLOAD GET STATE ACTIS (Puerto 42) =====
//Uplinks asociados:
// puerto 131 (info de estado)
//puerto 130 (reporte energía)
//puerto 120 (sensado de la fotocélula)
//puerto 121 (reporte fecha/hora)
//Cada bit del byte enviado solicita un reporte distinto del controlador.
export const PayloadGetStateActisSchema = z.object({
  reporteEnergia: z.boolean().optional(), // bit0 - puerto 130
  reporteEstado: z.boolean().optional(), // bit1 - puerto 131
  fotocelula: z.boolean().optional(), // bit2 - puerto 120
  fechaHora: z.boolean().optional(), // bit3 - puerto 121
});
export type PayloadGetStateActis = z.infer<typeof PayloadGetStateActisSchema>;

// ===== PAYLOAD GET CONFIG ACTIS (Puerto 15) =====
//Uplinks asociados:
// puerto 10 (setMode)
// puerto 12 (setOffset - reloj astronómico)
// puerto 13 (setThreshold - umbrales fotocélula)
// puerto 14 (setCoordinates)
//Cada bit del byte enviado al puerto 15 solicita la configuración correspondiente.
export const PayloadGetConfigActisSchema = z.object({
  setMode: z.boolean().optional(), // bit0 - puerto 10
  setOffset: z.boolean().optional(), // bit1 - puerto 12
  setThreshold: z.boolean().optional(), // bit2 - puerto 13
  setCoordinates: z.boolean().optional(), // bit3 - puerto 14
});
export type PayloadGetConfigActis = z.infer<typeof PayloadGetConfigActisSchema>;

// ===== PAYLOAD GET CONFIG GENERAL ACTIS (Puerto 45) =====
//Uplinks asociados:
// puerto 110 (versión FW microcontrolador)
// puerto 111 (versión FW módulo XDot)
// puerto 43  (configuración de reportes -> setReportConfig)
// puerto 44  (configuración de ACKs    -> setACKConfig)
//Cada bit del byte enviado solicita un parámetro distinto de la configuración general.
export const PayloadGetConfigGeneralActisSchema = z.object({
  versionFirmwareMCU: z.boolean().optional(), // bit0 - puerto 110
  versionFirmwareXDot: z.boolean().optional(), // bit1 - puerto 111
  configReportes: z.boolean().optional(), // bit2 - puerto 43 (setReportConfig)
  configACK: z.boolean().optional(), // bit3 - puerto 44 (setACKConfig)
});
export type PayloadGetConfigGeneralActis = z.infer<
  typeof PayloadGetConfigGeneralActisSchema
>;

// Estructura de perfiles de dimerizado para ACTIS FING
export const CambioDimmingACTISSchema = z.object({
  offsetMinutos: z.number().optional(), // -720 a 720 desde medianoche
  nivelDimming: z.number().optional(), // 0-31
});
export type ICambioDimmingACTIS = z.infer<typeof CambioDimmingACTISSchema>;

export const PerfilDiasSeleccionadosSchema = z.object({
  diasSemana: z.array(z.boolean()).optional(), // [domingo, lunes, ..., sábado]
  cambios: z.array(CambioDimmingACTISSchema).optional(),
});
export type IPerfilDiasSeleccionados = z.infer<
  typeof PerfilDiasSeleccionadosSchema
>;

export const PerfilDiaEspecialSchema = z.object({
  diaDelAnio: z.number().optional(), // 1-366
  cambios: z.array(CambioDimmingACTISSchema).optional(),
});
export type IPerfilDiaEspecial = z.infer<typeof PerfilDiaEspecialSchema>;

export const PerfilesDimmingACTISSchema = z.object({
  dimDefault: z.number().optional(), // 0-31
  perfilesHabilitados: z.number().optional(), // Byte con flags

  // 2 perfiles "Todos los días"
  perfilTodosLosDias1: z.array(CambioDimmingACTISSchema).optional(),
  perfilTodosLosDias2: z.array(CambioDimmingACTISSchema).optional(),

  // 2 perfiles "Días seleccionados"
  perfilDiasSemana1: PerfilDiasSeleccionadosSchema.optional(),
  perfilDiasSemana2: PerfilDiasSeleccionadosSchema.optional(),

  // 4 perfiles "Días especiales"
  perfilDiaEspecial1: PerfilDiaEspecialSchema.optional(),
  perfilDiaEspecial2: PerfilDiaEspecialSchema.optional(),
  perfilDiaEspecial3: PerfilDiaEspecialSchema.optional(),
  perfilDiaEspecial4: PerfilDiaEspecialSchema.optional(),
});

// Interface hand-written (no z.infer): config-perfil la usa dentro de
// z.custom<> y el declaration emitter expande los aliases z.infer (TS7056);
// las interfaces se imprimen por nombre.
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

export const PaquetesDispositivoLorawanSchema = z.object({
  inicioSesion: z.date().optional(), //Cuando inició la sesión actual del dispositivo
  fCntInicial: z.number().optional(), // fCnt inicial (normalmente 0, 1 o 2)
  ultimoFcnt: z.number().optional(), // Último fCnt recibido
  framesRecibidos: z.number().optional(), //Cantidad de frames recibidos
  perdidaPaquetes: z.number().optional(), // Porcentaje de pérdida de paquetes
});
export type IPaquetesDispositivoLorawan = z.infer<
  typeof PaquetesDispositivoLorawanSchema
>;

// Último gateway que captó el dispositivo. Se actualiza en cada uplink (o cada
// cierto TTL, en lora-luminarias) eligiendo el de mejor SNR (relación señal/ruido). Lo usa el orchestrator de downlinks (en el Cron)
// para hacer throttling por gateway (airtime compartido).

export const UltimoGatewaySchema = z.object({
  gatewayEui: z.string().optional(),
  rssi: z.number().optional(),
  snr: z.number().optional(),
  fechaCaptura: z.string().optional(), // ISO timestamp
});
export type IUltimoGateway = z.infer<typeof UltimoGatewaySchema>;

// Rastreo del cron de consulta de configuración inicial (gestion-cron). Una
// luminaria cuyo dispositivo nunca tuvo perfil ni SET manual nunca recibe un
// `get`, por lo que `config` queda vacía. Ese cron envía los GET pertinentes
// (origen 'ConsultaConfig') para hacer el bootstrap de la config real. Este
// sub-doc evita bucles infinitos en dispositivos que no responden: cuenta los
// intentos sin respuesta y bloquea temporalmente (circuit breaker) tras superar
// el máximo.
export const ConsultaConfigDispositivoSchema = z.object({
  intentos: z.number().optional(), // ciclos consultados sin que la config se complete
  ultimaConsulta: z.string().optional(), // ISO — última vez que se enviaron los gets
  bloqueadoHasta: z.string().optional(), // ISO — circuit breaker, no se consulta hasta que expire
});
export type IConsultaConfigDispositivo = z.infer<
  typeof ConsultaConfigDispositivoSchema
>;

//Información para cada punto del modo calendario
export const PuntoDimmerSchema = z.object({
  hora: z.string(),
  porcentaje: z.number(),
  activo: z.boolean(),
});
export type IPuntoDimmer = z.infer<typeof PuntoDimmerSchema>;

//Información para el modo calendario
export const DimmerCalendarioConfigSchema = z.object({
  calendarioHabilitado: z.boolean(),
  puntos: z.array(PuntoDimmerSchema),
  porcentajeDefecto: z.number(),
});
export type IDimmerCalendarioConfig = z.infer<
  typeof DimmerCalendarioConfigSchema
>;

/* ────────────────────────────────────────────────
 *  CONFIGURACIONES DE DISPOSITIVOS
 * ────────────────────────────────────────────────*/

export const DispositivoLuminariaGPESchema = z.object({
  configGeneral: ConfigGeneralGPESchema.optional(),
  configCalendario: DimmerCalendarioConfigSchema.optional(),
  alarma: z.string().optional(),
});

// Interfaces hand-written (no z.infer): config-perfil las usa dentro de
// z.custom<> y el declaration emitter expande los aliases z.infer (TS7056);
// las interfaces se imprimen por nombre.
export interface IDispositivoLuminariaGPE {
  configGeneral?: IConfigGeneralGPE;
  configCalendario?: IDimmerCalendarioConfig;
  alarma?: string;
}

//⚠️⚠️⚠️⚠️⚠️ No deberían haber datos energéticos en las configuraciones de los dispositivos. Peor bueno, son Wellness y ni se usan
export const DispositivoLuminariaWellnessSchema = z.object({
  mode: z.custom<IModoLuminaria>().optional(),
  activePowerTotal: z.number().optional(), // kWh - acumulada (A pesar de que digen power, realmente son energía)
  reactivePowerTotal: z.number().optional(), // kWh - acumulada
  turnOnOffStatus: z.boolean().optional(), // True: Encendido, False: Apagado
  alarma: z.string().optional(),
});

export interface IDispositivoLuminariaWellness {
  mode?: IModoLuminaria;
  activePowerTotal?: number; // kWh - acumulada (A pesar de que digen power, realmente son energía)
  reactivePowerTotal?: number; // kWh - acumulada
  turnOnOffStatus?: boolean; // True: Encendido, False: Apagado
  alarma?: string;
}

// Configuración para dispositivos ACTIS FING
export const DispositivoLuminariaACTISSchema = z.object({
  // ===== MODOS (Puerto 10 consultado por 15 / modo manual por 11 / reporte por 131) =====
  modoEncendido: ModosACTISSchema.optional(),
  modoApagado: ModosACTISSchema.optional(),
  iniciarEncendida: z.boolean().optional(),

  // ===== COORDENADAS GPS (Puerto 14 consultado por 15) =====
  coordenadas: z
    .object({
      geojson: GeoJSONPointSchema.optional(),
      timeZone: z.number().optional(), // UTC offset en horas
    })
    .optional(),

  // ===== FOTOCÉLULA (Puerto 13 consultado por 15) =====
  fotocelula: z
    .object({
      umbralSuperior: z.number().optional(), // 0-255 (0-3.3V)
      umbralInferior: z.number().optional(), // 0-255
      promedio: z.number().optional(), // Puerto 120: promedio último minuto (0-255)
    })
    .optional(),

  // ===== RELOJ ASTRONÓMICO (Puerto 12 consultado por 15) =====
  relojAstronomico: z
    .object({
      offsetAtardecer: z.number().optional(), // -128 a 127 minutos
      offsetAmanecer: z.number().optional(), // -128 a 127 minutos
    })
    .optional(),

  // ===== CONFIG REPORTES (Puerto 43 consultado por 45, reportes 130/131) =====
  configReportes: z
    .object({
      reportarEncendidoApagado: z.boolean().optional(), // bit0
      reportarDimerizado: z.boolean().optional(), // bit1
      periodoEstado: z.literal([0, 5, 15, 30, 60, 90, 120, 180]).optional(), // bits 2-4 (min)
      periodoEnergia: z.literal([0, 5, 15, 30, 60, 90, 120, 180]).optional(), // bits 5-7 (min)
    })
    .optional(),

  // ===== CONFIG ACK (Puerto 44 consultado por 45) =====
  configACK: z
    .object({
      periodoHoras: z.number().optional(), // bits 0-4 (0-31 horas)
      forzado: z.boolean().optional(), // bit5: envía mensaje vacío al expirar timer
      ackEstado: z.boolean().optional(), // bit6
      ackEnergia: z.boolean().optional(), // bit7
    })
    .optional(),

  // ===== PERFILES DIMERIZADO (Puertos 20-30) =====
  perfilesDimming: PerfilesDimmingACTISSchema.optional(),

  // ===== FIRMWARE =====
  versionFirmware: z.string().optional(), // Puerto 110
  versionModuloLoRa: z.string().optional(), // Puerto 111

  // ===== ALARMAS =====
  alarma: z.string().optional(),

  // ===== FECHA/HORA (Puerto 121) =====
  reporteFechaHora: z
    .object({
      reportada: z.string().optional(), // timestamp del dispositivo
      receivedAt: z.string().optional(), // timestamp de recepción API
    })
    .optional(),
});

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

// Union type para config (retrocompatibilidad - ahora se usa MapaConfigDispositivo)
export const DispositivoLuminariaConfigSchema = z.union([
  DispositivoLuminariaGPESchema,
  DispositivoLuminariaWellnessSchema,
  DispositivoLuminariaACTISSchema,
]);
export type IDispositivoLuminariaConfig =
  | IDispositivoLuminariaGPE
  | IDispositivoLuminariaWellness
  | IDispositivoLuminariaACTIS;

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

// Campos comunes a todas las variantes (sin tipo/config, que discriminan)
const DispositivoLorawanCamposSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idModeloDispositivo: z.string().optional(),
  fechaCreacion: z.string().optional(),

  // Campos comunes
  fechaUltimaComunicacion: z.string().optional(),
  ultimoReporte: z.custom<IReporteGenerico>().optional(),
  margin: z.number().optional(), //Es la señal del dispositivo, expresada en dB
  tiempoLimiteComunicacion: z.number().optional(), // Tiempo máximo sin reportar (en horas) antes de generar evento "Sin comunicación".

  ubicacion: GeoJSONPointSchema.optional(), // GeoJSON de la ubicacion del dispositivo
  ultimoComando: z.custom<IComando>().optional(), //Último downlink enviado a este dispositivo
  paquetes: PaquetesDispositivoLorawanSchema.optional(), //Información para calcular la pérdida de paquetes
  ultimoGateway: UltimoGatewaySchema.optional(), //Gateway con mejor señal en el último uplink capturado
  consultaConfig: ConsultaConfigDispositivoSchema.optional(), //Rastreo del cron de consulta de configuración inicial (bootstrap de config).

  // Datos para el lora server
  deveui: z.string().optional(),
  joineui: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  tags: z.record(z.string(), z.string()).optional(),
  applicationId: z.string().optional(),
  deviceProfileId: z.string().optional(),
  variables: z.record(z.string(), z.string()).optional(),
  isDisabled: z.boolean().optional(),
  skipFcntCheck: z.boolean().optional(),

  // Datos para OTAA
  appkey: z.string().optional(), //Con esta se completa tanto el appKey y el nwkKey para deviceKeys

  //Datos para ABP
  devAddr: z.string().optional(),
  appSKey: z.string().optional(),
  fCntUp: z.number().optional(),
  nFCntDown: z.number().optional(),
  nwkskey: z.string().optional(), //Con esta se completa fNwkSIntKey, nwkSEncKey y sNwkSIntKey para activationKeys

  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  modeloDispositivo: ModeloDispositivoSchema.optional(),
});

const VarianteDispositivoLorawanGPE = DispositivoLorawanCamposSchema.extend({
  tipo: z.literal('Luminaria GPE').optional(),
  config: DispositivoLuminariaGPESchema.optional(),
});
const VarianteDispositivoLorawanWellness =
  DispositivoLorawanCamposSchema.extend({
    tipo: z.literal('Luminaria Wellness').optional(),
    config: DispositivoLuminariaWellnessSchema.optional(),
  });
const VarianteDispositivoLorawanACTIS = DispositivoLorawanCamposSchema.extend({
  tipo: z.literal('Luminaria ACTIS FING').optional(),
  config: DispositivoLuminariaACTISSchema.optional(),
});

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export const DispositivoLorawanSchema = z.union([
  VarianteDispositivoLorawanGPE,
  VarianteDispositivoLorawanWellness,
  VarianteDispositivoLorawanACTIS,
]);

/**
 * Tipo hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
export type IDispositivoLorawan =
  | IDispositivoLorawanBase<'Luminaria GPE'>
  | IDispositivoLorawanBase<'Luminaria Wellness'>
  | IDispositivoLorawanBase<'Luminaria ACTIS FING'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

const camposOmitidos: {
  _id: true;
  cliente: true;
  ancestros: true;
  modeloDispositivo: true;
} = {
  _id: true,
  cliente: true,
  ancestros: true,
  modeloDispositivo: true,
};

/** Create: no incluimos los virtuales/ids que manejás en el backend.
 *  Mantiene `tipo` como discriminante para type safety.
 */
export const CreateDispositivoLorawanSchema = z.union([
  VarianteDispositivoLorawanGPE.omit(camposOmitidos),
  VarianteDispositivoLorawanWellness.omit(camposOmitidos),
  VarianteDispositivoLorawanACTIS.omit(camposOmitidos),
]);

type OmitirCreate = '_id' | 'cliente' | 'ancestros' | 'modeloDispositivo';

export type ICreateDispositivoLorawan =
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria GPE'>>, OmitirCreate>
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria Wellness'>>, OmitirCreate>
  | Omit<
      Partial<IDispositivoLorawanBase<'Luminaria ACTIS FING'>>,
      OmitirCreate
    >;

/** Update: permitimos campos parciales pero mantenemos `tipo` para que TS pueda discriminar.
 *  Cuando actualizás config, TypeScript valida que sea del tipo correcto según `tipo`.
 */
export const UpdateDispositivoLorawanSchema = z.union([
  VarianteDispositivoLorawanGPE.omit(camposOmitidos),
  VarianteDispositivoLorawanWellness.omit(camposOmitidos),
  VarianteDispositivoLorawanACTIS.omit(camposOmitidos),
]);

type OmitirUpdate = '_id' | 'cliente' | 'ancestros' | 'modeloDispositivo';

export type IUpdateDispositivoLorawan =
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria GPE'>>, OmitirUpdate>
  | Omit<Partial<IDispositivoLorawanBase<'Luminaria Wellness'>>, OmitirUpdate>
  | Omit<
      Partial<IDispositivoLorawanBase<'Luminaria ACTIS FING'>>,
      OmitirUpdate
    >;
