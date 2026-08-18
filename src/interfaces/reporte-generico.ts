// reporte-generico.ts
import { z } from 'zod';
import { GeoJSONPointSchema } from '../auxiliares';
import type { IActivo } from './activo';
import { ClienteSchema, ICliente } from './cliente';
import type { IDispositivoLorawan } from './dispositivo-lorawan';
import type { IGrupo } from './grupo';
import type { ILuminaria } from './luminaria';
import type { IRecorrido } from './recorrido';
import type { ITracker } from './tracker';
import type { IUsuario } from './usuario';

export const TipoTriangulacionSchema = z.enum(['GNSS', 'Wifi']);
export type TipoTriangulacion = z.infer<typeof TipoTriangulacionSchema>;

export const ModoForzadoSchema = z.enum([
  'No Forzado',
  'Forzado Encendido',
  'Forzado Apagado',
]);
export type ModoForzado = z.infer<typeof ModoForzadoSchema>;

export const ModoLuminariaSchema = z.enum([
  'Indeterminado',
  'Fotocélula',
  'Astronómico',
  'Por Defecto',
  'Manual',
]);
export type IModoLuminaria = z.infer<typeof ModoLuminariaSchema>;

/* ────────────────────────────────────────────────
 *  TIPOS BASE
 * ────────────────────────────────────────────────*/

export const TipoValoresReporteSchema = z.enum([
  'Luminaria GPE Periódico',
  'Luminaria GPE Energía',
  'Luminaria Wellness',
  'Luminaria ACTIS FING Estado',
  'Luminaria ACTIS FING Energía',
  'Luminaria CitiLight Estado',
  'Luminaria CitiLight Energía',
  'Luminaria CitiLight Alerta',
  'Tracker 4G',
  'Tracker 4G Combustible',
  'Tracker 4G Temperatura',
  'Tracker T1000B',
  'Tracker Qualcomm',
  'Tracker Telefono',
]);
export type TipoValoresReporte = z.infer<typeof TipoValoresReporteSchema>;

export const TipoEntidadReporteSchema = z.enum([
  'Luminaria',
  'Colectivo',
  'Activo',
  'Tracker',
  'Vehiculo',
]);
export type TipoEntidadReporte = z.infer<typeof TipoEntidadReporteSchema>;

/* ────────────────────────────────────────────────
 *  REPORTES POR TIPO
 * ────────────────────────────────────────────────*/

export const ReporteLuminariaGPESchema = z.object({
  turnOnOffStatus: z.boolean().optional(),
  modo: ModoLuminariaSchema.optional(),
  estadoRele: z.boolean().optional(),
  dimmerHabilitado: z.boolean().optional(),
  energiaExterna: z.boolean().optional(),
  potencia: z.number().optional(),
  voltaje: z.number().optional(),
  dimmingValue: z.number().optional(),
  fCnt: z.number().optional(),
  alarmas: z.array(z.string()).optional(),
  esDeDia: z.boolean().optional(),
  horaAmanecer: z.string().optional(),
  horaAtardecer: z.string().optional(),
  tiempoEncendida: z.number().optional(), // En horas
});
export type IReporteLuminariaGPE = z.infer<typeof ReporteLuminariaGPESchema>;

export const ReporteLuminariaGPEEnergiaSchema = z.object({
  corriente: z.number().optional(),
  voltaje: z.number().optional(),
  potencia: z.number().optional(),
  energia: z.number().optional(),
  energiaTotal: z.number().optional(),
  factorPotencia: z.number().optional(),
  fCnt: z.number().optional(),
  esDeDia: z.boolean().optional(),
  horaAmanecer: z.string().optional(),
  horaAtardecer: z.string().optional(),
  alarmas: z.array(z.string()).optional(),
});
export type IReporteLuminariaGPEEnergia = z.infer<
  typeof ReporteLuminariaGPEEnergiaSchema
>;

export const ReporteLuminariaWellnessSchema = z.object({
  dimmingValue: z.number().optional(),
  turnOnOffStatus: z.boolean().optional(),
  voltage: z.number().optional(),
  current: z.number().optional(),
  activePower: z.number().optional(),
  reactivePower: z.number().optional(),
  activePowerTotal: z.number().optional(),
  reactivePowerTotal: z.number().optional(),
  temperature: z.number().optional(),
  lumenes: z.number().optional(),
  modo: ModoLuminariaSchema.optional(),
  modoForzado: ModoForzadoSchema.optional(),
  alarmas: z.array(z.string()).optional(),
});
export type IReporteLuminariaWellness = z.infer<
  typeof ReporteLuminariaWellnessSchema
>;

// ===== ACTIS FING =====
// Reporte de estado (Puerto 131: 1 byte - encendido/apagado, motivo, nivel dimming)
export const ReporteLuminariaACTISEstadoSchema = z.object({
  turnOnOffStatus: z.boolean().optional(),
  modo: ModoLuminariaSchema.optional(),
  estadoRele: z.boolean().optional(),
  dimmingValue: z.number().optional(),
  fCnt: z.number().optional(),
  esDeDia: z.boolean().optional(),
  horaAmanecer: z.string().optional(),
  horaAtardecer: z.string().optional(),
  tiempoEncendida: z.number().optional(), // En horas
  alarmas: z.array(z.string()).optional(),
});
export type IReporteLuminariaACTISEstado = z.infer<
  typeof ReporteLuminariaACTISEstadoSchema
>;

// Reporte de energía (Puerto 130: 3 bytes - voltaje delta, corriente, factor de potencia)
export const ReporteLuminariaACTISEnergiaSchema = z.object({
  corriente: z.number().optional(),
  voltaje: z.number().optional(),
  potencia: z.number().optional(),
  factorPotencia: z.number().optional(),
  fCnt: z.number().optional(),
  esDeDia: z.boolean().optional(),
  horaAmanecer: z.string().optional(),
  horaAtardecer: z.string().optional(),
  alarmas: z.array(z.string()).optional(),
  energiaTotal: z.number().optional(), // kWh acumulado total calculado por integración temporal
});
export type IReporteLuminariaACTISEnergia = z.infer<
  typeof ReporteLuminariaACTISEnergiaSchema
>;

// ===== CitiLight =====
// El ILC tiene 4 uplinks. SOLO 3 son reportes (telemetría historizable):
// Estado (Heartbeat), Energía, Alerta. El 4º, Notification (01/40), NO es reporte:
// trae metadata de config/estado (RTC, firmware, multicast, scheduleConfigStatus,
// systemConfigStatus) que se refleja en `dispositivo.config`, no se historiza.
//
// Estado (Heartbeat packet 05/1B): el heartbeat SOLO envía relé + dimming (+ reserved).
// tiempoEncendida y esDeDia se calculan en backend.
// `modo`: NO viene en el heartbeat. El decoder lo DENORMALIZA acá tomándolo del
// scheduleConfigStatus del último Notification (dispositivo.config: astronómico/manual/
// ninguno). Se guarda en el reporte para que el snapshot periódico sea consistente con
// GPE/ACTIS y el cálculo de estado + dashboards lo lean igual que en los otros tipos.
export const ReporteLuminariaCitiLightEstadoSchema = z.object({
  turnOnOffStatus: z.boolean().optional(), // Relay Status (on/off)
  estadoRele: z.boolean().optional(), // = Relay Status
  dimmingValue: z.number().optional(), // % (Dimming Status)
  modo: ModoLuminariaSchema.optional(), // denormalizado desde Notification (no del heartbeat)
  tiempoEncendida: z.number().optional(), // En horas (acumulado en backend)
  esDeDia: z.boolean().optional(), // calculado en backend (SunCalc)
  fCnt: z.number().optional(),
  alarmas: z.array(z.string()).optional(),
});
export type IReporteLuminariaCitiLightEstado = z.infer<
  typeof ReporteLuminariaCitiLightEstadoSchema
>;

// Energía (Energy packet 01/60): corriente mA, voltaje V, PF, relé, dimming.
export const ReporteLuminariaCitiLightEnergiaSchema = z.object({
  corriente: z.number().optional(), // mA
  voltaje: z.number().optional(), // V
  potencia: z.number().optional(), // W (calculada)
  factorPotencia: z.number().optional(),
  energiaTotal: z.number().optional(), // kWh acumulado (integración temporal)
  estadoRele: z.boolean().optional(),
  turnOnOffStatus: z.boolean().optional(),
  dimmingValue: z.number().optional(), // %
  epochtime: z.number().optional(), // Unix epoch del dispositivo (segundos)
  fCnt: z.number().optional(),
  esDeDia: z.boolean().optional(),
  alarmas: z.array(z.string()).optional(),
});
export type IReporteLuminariaCitiLightEnergia = z.infer<
  typeof ReporteLuminariaCitiLightEnergiaSchema
>;

// Alerta (Alert packet 02/61): temperatura/lux + flags de falla (booleanos limpios).
export const ReporteLuminariaCitiLightAlertaSchema = z.object({
  temperatura: z.number().optional(), // °C
  lux: z.number().optional(),
  lowVoltage: z.boolean().optional(), // flag subtensión
  highVoltage: z.boolean().optional(), // flag sobretensión
  highCurrent: z.boolean().optional(), // flag sobrecorriente
  lightFault: z.boolean().optional(), // flag falla de luminaria
  epochtime: z.number().optional(), // Unix epoch del dispositivo (segundos)
  fCnt: z.number().optional(),
  alarmas: z.array(z.string()).optional(),
});
export type IReporteLuminariaCitiLightAlerta = z.infer<
  typeof ReporteLuminariaCitiLightAlertaSchema
>;

export const ReporteTrackerSchema = z.object({
  fechaDevice: z.string().optional(),
  geojson: GeoJSONPointSchema.optional(),
  snappedGeojson: GeoJSONPointSchema.optional(),
  snapDivergence: z.number().optional(), // Diferencia entre posición original y "snapped" en metros
  direccion: z.string().optional(),
  velocidad: z.number().optional(),
  orientacion: z.number().optional(),
  ignicion: z.boolean().optional(),
  raw: z.string().optional(), // Crudo para diagnóstico o datos adicionales no estructurados
});
export type IReporteTracker = z.infer<typeof ReporteTrackerSchema>;

/**
 * Telemetría OBD leída del CAN bus del vehículo (bloque CAN Data del reporte ERI
 * de Queclink). Todos los campos son opcionales: el equipo sólo envía los que su
 * <CAN Bus Report Mask> habilita y que el vehículo expone. El catchall
 * cubre los campos menos comunes (camión/tacógrafo/eléctrico) sin enumerarlos.
 */
export const ReporteTrackerOBDSchema = z
  .object({
    vin: z.string().optional(), // Número de chasis
    ignicionKey: z.number().optional(), // Estado de ignición leído del CAN (0-2)
    distanciaTotal: z.number().optional(), // Odómetro del vehículo
    distanciaTotalFuente: z.enum(['dashboard', 'impulsos']).optional(),
    combustibleUsadoTotal: z.number().optional(), // Combustible consumido acumulado
    combustibleUsadoTotalUnidad: z.enum(['L', 'K']).optional(),
    rpm: z.number().optional(), // Revoluciones del motor
    velocidad: z.number().optional(), // Velocidad del vehículo (km/h) según CAN
    temperaturaRefrigerante: z.number().optional(), // °C
    consumoCombustible: z.number().optional(), // Consumo instantáneo
    // Desambigua `consumoCombustible`: el mismo campo es L/h (consumo por
    // tiempo, típico de OBD en ralentí) o L/100km (consumo por distancia)
    // según el equipo. Sin esto un número suelto no se puede interpretar.
    consumoCombustibleUnidad: z.enum(['L/h', 'L/100km']).optional(),
    nivelCombustible: z.number().optional(), // Nivel de combustible
    nivelCombustibleUnidad: z.enum(['L', '%']).optional(),
    autonomia: z.number().optional(), // Km estimados con el combustible restante (hm)
    pedalAcelerador: z.number().optional(), // % de presión del pedal
    horasMotor: z.number().optional(), // Horas totales de motor
    tiempoConduccion: z.number().optional(), // Horas en marcha
    tiempoRalenti: z.number().optional(), // Horas en ralentí
    combustibleRalenti: z.number().optional(), // Combustible consumido en ralentí
    combustibleRalentiUnidad: z.enum(['L', 'K']).optional(),
    temperaturaAmbiente: z.number().optional(), // °C
    // PIDs estándar de OBD-II que no reporta Queclink pero sí TopFlyTech
    // (TorchX). Van con el nombre canónico para que un consumidor no tenga
    // que saber de qué equipo vino el dato.
    cargaMotor: z.number().optional(), // % de carga del motor (PID 0x04)
    presionAdmision: z.number().optional(), // kPa, presión del múltiple (PID 0x0B)
    temperaturaAdmision: z.number().optional(), // °C del aire de admisión (PID 0x0F)
    flujoAire: z.number().optional(), // g/s del caudalímetro (PID 0x10)
    dtc: z.array(z.string()).optional(), // Códigos de falla activos (DTC)
    canMaskRaw: z.string().optional(), // <CAN Bus Report Mask> crudo (diagnóstico)
    _parcial: z.boolean().optional(), // true si quedó un sub-bloque sin parsear (ver rawTail)
    rawTail: z.string().optional(), // Resto crudo del bloque CAN no decodificado
  })
  .catchall(z.unknown()); // Campos extra (ejes, tacógrafo, eléctrico, etc.)
export type IReporteTrackerOBD = z.infer<typeof ReporteTrackerOBDSchema>;

export const ReporteTracker4GSchema = ReporteTrackerSchema.extend({
  uniqueId: z.string().optional(),
  odometro: z.number().optional(),
  triperoState: z
    .enum(['STOPPED', 'IDLE', 'MOVING', 'UNKNOWN', 'OFFLINE'])
    .optional(),
  triperoStateDuration: z.number().optional(),
  triperoCurrentTripId: z.string().optional(),
  triperoCurrentTripDistance: z.number().optional(),
  // Telemetría OBD/CAN del vehículo (ej: Queclink GV350CEU con el bit 2 del
  // <ERI Mask>, o TopFlyTech TorchX enchufado al OBDII). Presente solo cuando
  // el equipo puede leer el bus del vehículo.
  obd: ReporteTrackerOBDSchema.optional(),
});
export type IReporteTracker4G = z.infer<typeof ReporteTracker4GSchema>;

export const ReporteTrackerT1000BSchema = ReporteTrackerSchema.extend({
  devEui: z.string().optional(),
  bateria: z.number().optional(),
  tipoTriangulacion: TipoTriangulacionSchema.optional(),
});
export type IReporteTrackerT1000B = z.infer<typeof ReporteTrackerT1000BSchema>;

export const ReporteTrackerQualcommSchema = ReporteTrackerSchema.extend({
  bateria: z.number().optional(),
  tipoTriangulacion: TipoTriangulacionSchema.optional(),
});
export type IReporteTrackerQualcomm = z.infer<
  typeof ReporteTrackerQualcommSchema
>;

export const ReporteTrackerTelefonoSchema = ReporteTrackerSchema.extend({
  deviceId: z.string().optional(),
});
export type IReporteTrackerTelefono = z.infer<
  typeof ReporteTrackerTelefonoSchema
>;

export const ReporteTrackerTemperaturaSchema = z.object({
  uniqueId: z.string().optional(),
  temperatura: z.number().optional(), // °C con signo (ej: +20.5, -5.2)
  tramaRaw: z.string().optional(), // Trama completa para diagnóstico
  geojson: GeoJSONPointSchema.optional(), // Última posición conocida (≤5 min)
});
export type IReporteTrackerTemperatura = z.infer<
  typeof ReporteTrackerTemperaturaSchema
>;

export const ReporteTrackerCombustibleSchema = z.object({
  uniqueId: z.string().optional(),
  // Nivel por tanque (litros). Solo se incluyen los sensores conectados.
  nivelCombustible1: z.number().optional(), // Sensor 1
  nivelCombustible2: z.number().optional(), // Sensor 2
  nivelCombustible3: z.number().optional(), // Sensor 3
  nivelCombustible4: z.number().optional(), // Sensor 4
  nivelCombustibleTotal: z.number().optional(), // Suma de sensores conectados (litros)
  temperaturaCombustible: z.number().optional(), // °C
  alarmaAgua: z.boolean().optional(), // Agua o cortocircuito en varillas
  ignicionVirtualSensor: z.boolean().optional(), // Estado motor reportado por el sensor
  // Variación (solo en tramas FVAR)
  variacionCombustible: z.number().optional(), // Litros con signo (+carga / -descarga)
  idSensorVariacion: z.number().optional(), // ID del sensor que detectó la variación
  nivelPostVariacion: z.number().optional(), // Litros en tanque después de la variación
  // Debug / diagnóstico
  debugValue: z.string().optional(), // Valor lógico crudo del sensor
  tramaRaw: z.string().optional(), // Trama completa para diagnóstico
  geojson: GeoJSONPointSchema.optional(), // Última posición conocida (≤5 min)
});
export type IReporteTrackerCombustible = z.infer<
  typeof ReporteTrackerCombustibleSchema
>;

/* ────────────────────────────────────────────────
 *  MAPA DE TIPOS DE REPORTE → DATOS
 * ────────────────────────────────────────────────*/

export type MapaValoresReporte = {
  'Luminaria GPE Periódico': IReporteLuminariaGPE;
  'Luminaria GPE Energía': IReporteLuminariaGPEEnergia;
  'Luminaria Wellness': IReporteLuminariaWellness;
  'Luminaria ACTIS FING Estado': IReporteLuminariaACTISEstado;
  'Luminaria ACTIS FING Energía': IReporteLuminariaACTISEnergia;
  'Luminaria CitiLight Estado': IReporteLuminariaCitiLightEstado;
  'Luminaria CitiLight Energía': IReporteLuminariaCitiLightEnergia;
  'Luminaria CitiLight Alerta': IReporteLuminariaCitiLightAlerta;
  'Tracker 4G': IReporteTracker4G;
  'Tracker T1000B': IReporteTrackerT1000B;
  'Tracker Qualcomm': IReporteTrackerQualcomm;
  'Tracker 4G Combustible': IReporteTrackerCombustible;
  'Tracker 4G Temperatura': IReporteTrackerTemperatura;
  'Tracker Telefono': IReporteTrackerTelefono;
};

/* ────────────────────────────────────────────────
 *  TIPO VALORES REUTILIZABLE
 * ────────────────────────────────────────────────*/

export type ValoresReporte<T extends keyof MapaValoresReporte> = {
  timestamp?: string;
} & MapaValoresReporte[T];

/* ────────────────────────────────────────────────
 *  BASE DEL REPORTE (GENÉRICO)
 *
 *  Tipo legacy hand-written: el discriminante `tipoReporte` es OPCIONAL acá,
 *  pero REQUERIDO en los schemas Zod de abajo (contrato de validación más
 *  estricto para datos nuevos). Por eso este tipo NO se deriva con z.infer.
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
  | IReporteBase<'Luminaria CitiLight Estado'>
  | IReporteBase<'Luminaria CitiLight Energía'>
  | IReporteBase<'Luminaria CitiLight Alerta'>
  | IReporteBase<'Tracker 4G'>
  | IReporteBase<'Tracker T1000B'>
  | IReporteBase<'Tracker Qualcomm'>
  | IReporteBase<'Tracker 4G Combustible'>
  | IReporteBase<'Tracker 4G Temperatura'>
  | IReporteBase<'Tracker Telefono'>;

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
  | Omit<IReporteBase<'Luminaria CitiLight Estado'>, Omitir>
  | Omit<IReporteBase<'Luminaria CitiLight Energía'>, Omitir>
  | Omit<IReporteBase<'Luminaria CitiLight Alerta'>, Omitir>
  | Omit<IReporteBase<'Tracker 4G'>, Omitir>
  | Omit<IReporteBase<'Tracker T1000B'>, Omitir>
  | Omit<IReporteBase<'Tracker Qualcomm'>, Omitir>
  | Omit<IReporteBase<'Tracker 4G Combustible'>, Omitir>
  | Omit<IReporteBase<'Tracker 4G Temperatura'>, Omitir>
  | Omit<IReporteBase<'Tracker Telefono'>, Omitir>;

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
  | ({ tipoReporte: 'Luminaria CitiLight Estado' } & Partial<
      Omit<IReporteBase<'Luminaria CitiLight Estado'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Luminaria CitiLight Energía' } & Partial<
      Omit<IReporteBase<'Luminaria CitiLight Energía'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Luminaria CitiLight Alerta' } & Partial<
      Omit<IReporteBase<'Luminaria CitiLight Alerta'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker 4G' } & Partial<
      Omit<IReporteBase<'Tracker 4G'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker T1000B' } & Partial<
      Omit<IReporteBase<'Tracker T1000B'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker Qualcomm' } & Partial<
      Omit<IReporteBase<'Tracker Qualcomm'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker 4G Combustible' } & Partial<
      Omit<IReporteBase<'Tracker 4G Combustible'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker 4G Temperatura' } & Partial<
      Omit<IReporteBase<'Tracker 4G Temperatura'>, Omitir | 'tipoReporte'>
    >)
  | ({ tipoReporte: 'Tracker Telefono' } & Partial<
      Omit<IReporteBase<'Tracker Telefono'>, Omitir | 'tipoReporte'>
    >);

/* ────────────────────────────────────────────────
 *  SCHEMAS ZOD (nuevos, discriminante REQUERIDO)
 *
 *  Para validación runtime y JSON Schema de datos nuevos. A diferencia de los
 *  tipos legacy de arriba, acá `tipoReporte` es obligatorio (z.discriminatedUnion
 *  lo exige). Los populates hacia el SCC van como getters (ciclo de imports).
 * ────────────────────────────────────────────────*/

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
//
// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts. `idEntidad`/`idsAsignados` SON ObjectId
// (a diferencia de `UltimoReporteGenerico`, donde son string plano) pero sin
// `x-ref`: no tienen virtual con su propio nombre — se populan bajo otro
// nombre (dispositivoLora/tracker desde idEntidad; grupos/activo/recorrido/
// usuario/luminaria desde idsAsignados), igual que en evento-generico.ts.
const camposComunesReporte = {
  _id: z.string().optional(),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  expireAt: z.string().optional().meta({ 'x-bson': 'date' }),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idEntidad: z.string().optional().meta({ 'x-bson': 'objectId' }),
  idsAsignados: z.array(z.string()).optional().meta({ 'x-bson': 'objectId' }),
  tipoEntidad: TipoEntidadReporteSchema.optional(),
  cliente: ClienteSchema.optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idCliente',
      foreignField: '_id',
      justOne: true,
    },
  }),
  ancestros: z.array(ClienteSchema).optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idsAncestros',
      foreignField: '_id',
      justOne: false,
    },
  }),
  dispositivoLora: z.custom<IDispositivoLorawan>().optional().meta({
    'x-populate': {
      ref: 'DispositivoLorawanSchema',
      localField: 'idEntidad',
      foreignField: '_id',
      justOne: true,
    },
  }),
  tracker: z.custom<ITracker>().optional().meta({
    'x-populate': {
      ref: 'TrackerSchema',
      localField: 'idEntidad',
      foreignField: '_id',
      justOne: true,
    },
  }),
  grupos: z.array(z.custom<IGrupo>()).optional().meta({
    'x-populate': {
      ref: 'GrupoSchema',
      localField: 'idsAsignados',
      foreignField: '_id',
      justOne: false,
    },
  }),
  activo: z.custom<IActivo>().optional().meta({
    'x-populate': {
      ref: 'ActivoSchema',
      localField: 'idsAsignados',
      foreignField: '_id',
      justOne: false,
    },
  }),
  recorrido: z.custom<IRecorrido>().optional().meta({
    'x-populate': {
      ref: 'RecorridoSchema',
      localField: 'idsAsignados',
      foreignField: '_id',
      justOne: false,
    },
  }),
  usuario: z.custom<IUsuario>().optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idsAsignados',
      foreignField: '_id',
      justOne: false,
    },
  }),
  luminaria: z.custom<ILuminaria>().optional().meta({
    'x-populate': {
      ref: 'LuminariaSchema',
      localField: 'idsAsignados',
      foreignField: '_id',
      justOne: false,
    },
  }),
};

const varianteReporte = <T extends TipoValoresReporte, V extends z.ZodRawShape>(
  tipo: T,
  valores: z.ZodObject<V>,
) =>
  z.object({
    ...camposComunesReporte,
    tipoReporte: z.literal(tipo),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    // OJO — `valores.timestamp` es un STRING en BSON, NO una fecha
    // (CLAUDE.md §3 de gestion-datos-go, el bug silencioso más caro del
    // repo): NUNCA anotar `timestamp` con `x-bson: 'date'`. Un bound Date
    // contra un valor string no matchea nunca (type bracketing de Mongo) y
    // los exports de reportes devuelven vacío sin ningún error. Lo fija
    // `TestCastStringTypeStaysString` (gestion-datos-go,
    // internal/db/query/cast_test.go:73).
    valores: valores
      .extend({ timestamp: z.string().optional() })
      .optional()
      .meta({ 'x-bson': 'mixed' }),
  });

const vRepLumGPE = varianteReporte('Luminaria GPE Periódico', ReporteLuminariaGPESchema);
const vRepLumGPEEnergia = varianteReporte('Luminaria GPE Energía', ReporteLuminariaGPEEnergiaSchema);
const vRepLumWellness = varianteReporte('Luminaria Wellness', ReporteLuminariaWellnessSchema);
const vRepLumACTISEstado = varianteReporte('Luminaria ACTIS FING Estado', ReporteLuminariaACTISEstadoSchema);
const vRepLumACTISEnergia = varianteReporte('Luminaria ACTIS FING Energía', ReporteLuminariaACTISEnergiaSchema);
const vRepLumCitiLightEstado = varianteReporte('Luminaria CitiLight Estado', ReporteLuminariaCitiLightEstadoSchema);
const vRepLumCitiLightEnergia = varianteReporte('Luminaria CitiLight Energía', ReporteLuminariaCitiLightEnergiaSchema);
const vRepLumCitiLightAlerta = varianteReporte('Luminaria CitiLight Alerta', ReporteLuminariaCitiLightAlertaSchema);
const vRepTracker4G = varianteReporte('Tracker 4G', ReporteTracker4GSchema);
const vRepTrackerT1000B = varianteReporte('Tracker T1000B', ReporteTrackerT1000BSchema);
const vRepTrackerQualcomm = varianteReporte('Tracker Qualcomm', ReporteTrackerQualcommSchema);
const vRepTrackerCombustible = varianteReporte('Tracker 4G Combustible', ReporteTrackerCombustibleSchema);
const vRepTrackerTemperatura = varianteReporte('Tracker 4G Temperatura', ReporteTrackerTemperaturaSchema);
const vRepTrackerTelefono = varianteReporte('Tracker Telefono', ReporteTrackerTelefonoSchema);

export const ReporteGenericoSchema = z.discriminatedUnion('tipoReporte', [
  vRepLumGPE,
  vRepLumGPEEnergia,
  vRepLumWellness,
  vRepLumACTISEstado,
  vRepLumACTISEnergia,
  vRepLumCitiLightEstado,
  vRepLumCitiLightEnergia,
  vRepLumCitiLightAlerta,
  vRepTracker4G,
  vRepTrackerT1000B,
  vRepTrackerQualcomm,
  vRepTrackerCombustible,
  vRepTrackerTemperatura,
  vRepTrackerTelefono,
]).meta({ 'x-collection': 'reportegenericos' });

// Mismo set que el type Omitir de arriba
const omitirCreateUpdateReporte = {
  _id: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
  dispositivoLora: true,
  tracker: true,
  grupos: true,
  activo: true,
  recorrido: true,
  usuario: true,
  luminaria: true,
} as const;

export const CreateReporteGenericoSchema = z.discriminatedUnion('tipoReporte', [
  vRepLumGPE.omit(omitirCreateUpdateReporte),
  vRepLumGPEEnergia.omit(omitirCreateUpdateReporte),
  vRepLumWellness.omit(omitirCreateUpdateReporte),
  vRepLumACTISEstado.omit(omitirCreateUpdateReporte),
  vRepLumACTISEnergia.omit(omitirCreateUpdateReporte),
  vRepLumCitiLightEstado.omit(omitirCreateUpdateReporte),
  vRepLumCitiLightEnergia.omit(omitirCreateUpdateReporte),
  vRepLumCitiLightAlerta.omit(omitirCreateUpdateReporte),
  vRepTracker4G.omit(omitirCreateUpdateReporte),
  vRepTrackerT1000B.omit(omitirCreateUpdateReporte),
  vRepTrackerQualcomm.omit(omitirCreateUpdateReporte),
  vRepTrackerCombustible.omit(omitirCreateUpdateReporte),
  vRepTrackerTemperatura.omit(omitirCreateUpdateReporte),
  vRepTrackerTelefono.omit(omitirCreateUpdateReporte),
]);

// Update: parcial pero con el discriminante requerido de nuevo (patrón UpdatePermisoSchema de acceso-modelos)
export const UpdateReporteGenericoSchema = z.discriminatedUnion('tipoReporte', [
  vRepLumGPE.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria GPE Periódico') }),
  vRepLumGPEEnergia.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria GPE Energía') }),
  vRepLumWellness.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria Wellness') }),
  vRepLumACTISEstado.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria ACTIS FING Estado') }),
  vRepLumACTISEnergia.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria ACTIS FING Energía') }),
  vRepLumCitiLightEstado.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria CitiLight Estado') }),
  vRepLumCitiLightEnergia.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria CitiLight Energía') }),
  vRepLumCitiLightAlerta.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Luminaria CitiLight Alerta') }),
  vRepTracker4G.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Tracker 4G') }),
  vRepTrackerT1000B.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Tracker T1000B') }),
  vRepTrackerQualcomm.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Tracker Qualcomm') }),
  vRepTrackerCombustible.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Tracker 4G Combustible') }),
  vRepTrackerTemperatura.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Tracker 4G Temperatura') }),
  vRepTrackerTelefono.omit(omitirCreateUpdateReporte).partial().extend({ tipoReporte: z.literal('Tracker Telefono') }),
]);
