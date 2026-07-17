import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';

export const AgrupacionTiempoSchema = z.enum([
  'Diario',
  'Semanal',
  'Mensual',
  'Anual',
  'Horario',
]);
export type AgrupacionTiempo = z.infer<typeof AgrupacionTiempoSchema>;

export const AgrupacionResumenSchema = z.enum([
  'Cliente',
  'Grupo',
  'Individual',
]);
export type AgrupacionResumen = z.infer<typeof AgrupacionResumenSchema>;

export const TipoResumenDatosSchema = z.enum([
  'Consumo Mensual Luminarias',
  'Encendido Diario Luminarias',
  'Informe Diario Luminarias',
  'Consumo Mensual Combustible Vehículos',
  'Temperatura Horaria Vehículos',
  'Combustible Horario Vehículos',
  'Informe Cargas Combustible',
  'Informe Eventos Sospechosos Combustible',
  'Informe Mensual Flota Combustible',
  'Gastos del Cliente',
]);
export type TipoResumenDatos = z.infer<typeof TipoResumenDatosSchema>;

export const TipoEntidadResumenSchema = z.enum([
  'Luminaria',
  'Puesta',
  'Vehículo',
  'Alarma',
]);
export type TipoEntidadResumen = z.infer<typeof TipoEntidadResumenSchema>;

export const MonedaResumenSchema = z.enum(['ARS', 'USD']);
export type MonedaResumen = z.infer<typeof MonedaResumenSchema>;

/* ────────────────────────────────────────────────
 *  RESÚMENES
 * ────────────────────────────────────────────────*/

export const ConsumoMensualLuminariasSchema = z.object({
  consumoTotal: z.number().optional(),
  totalDispositivos: z.number().optional(),
});
export type IConsumoMensualLuminarias = z.infer<
  typeof ConsumoMensualLuminariasSchema
>;

export const EncendidoDiarioLuminariasSchema = z.object({
  tiempoEncendidoTotal: z.number().optional(),
  totalDispositivos: z.number().optional(),
  tiempoEncendidoPromedio: z.number().optional(),
});
export type IEncendidoDiarioLuminarias = z.infer<
  typeof EncendidoDiarioLuminariasSchema
>;

export const InformeDiarioLuminariasSchema = z.object({
  // Generales
  totalLuminarias: z.number().optional(),

  // Encendido / Apagado (de ultimoReportePeriodico.valores.turnOnOffStatus)
  luminariasEncendidas: z.number().optional(),
  luminariasApagadas: z.number().optional(),
  sinDatoEncendido: z.number().optional(), // Sin reporte periódico reciente

  // Conectividad (fechaUltimaComunicacion dentro de las últimas 24h)
  luminariasConectadas: z.number().optional(),
  luminariasDesconectadas: z.number().optional(),

  // Estado operativo (campo `estado` de la luminaria)
  luminariasOperativas: z.number().optional(),
  luminariasEnMantenimiento: z.number().optional(),
  sinEstado: z.number().optional(), // Sin campo `estado` asignado

  // Consumo energético del día en kWh (reservado para implementación futura)
  consumoTotal: z.number().optional(),

  // Alertas (de ultimoReportePeriodico.valores.alarmas)
  luminariasConAlarmas: z.number().optional(),
  tiposAlarmas: z.record(z.string(), z.number()).optional(), // { 'Sobre voltaje': 2, 'Fallo LED': 1 }

  // Cortes de energía (luminarias GPE con energiaExterna === false en último reporte)
  luminariasConCortesEnergia: z.number().optional(),
});
export type IInformeDiarioLuminarias = z.infer<
  typeof InformeDiarioLuminariasSchema
>;

export const TemperaturaHorariaVehiculoSchema = z.object({
  temperaturaPromedio: z.number().optional(), // °C promedio de la hora
  temperaturaMin: z.number().optional(), // °C mínima de la hora
  temperaturaMax: z.number().optional(), // °C máxima de la hora
  cantidadReportes: z.number().optional(), // cantidad de reportes procesados
});
export type ITemperaturaHorariaVehiculo = z.infer<
  typeof TemperaturaHorariaVehiculoSchema
>;

export const CombustibleHorarioVehiculoSchema = z.object({
  // Total (suma de sensores conectados)
  nivelPromedio: z.number().optional(), // nivel promedio de la hora
  nivelMin: z.number().optional(), // nivel mínimo de la hora
  nivelMax: z.number().optional(), // nivel máximo de la hora
  // Por sensor (1-4). Se omiten si el sensor no reportó en la hora.
  nivelPromedio1: z.number().optional(),
  nivelMin1: z.number().optional(),
  nivelMax1: z.number().optional(),
  nivelPromedio2: z.number().optional(),
  nivelMin2: z.number().optional(),
  nivelMax2: z.number().optional(),
  nivelPromedio3: z.number().optional(),
  nivelMin3: z.number().optional(),
  nivelMax3: z.number().optional(),
  nivelPromedio4: z.number().optional(),
  nivelMin4: z.number().optional(),
  nivelMax4: z.number().optional(),
  cantidadReportes: z.number().optional(), // cantidad de reportes procesados (del Total)
});
export type ICombustibleHorarioVehiculo = z.infer<
  typeof CombustibleHorarioVehiculoSchema
>;

/* ────────────────────────────────────────────────
 *  COMBUSTIBLE — CARGAS
 * ────────────────────────────────────────────────*/

const PuntoGeojsonSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const EventoCargaCombustibleSchema = z.object({
  idActivo: z.string().optional(),
  nombreActivo: z.string().optional(),
  fecha: z.string().optional(), // ISO timestamp del evento
  litrosCargados: z.number().optional(), // variacionCombustible (positivo)
  nivelPostCarga: z.number().optional(), // nivelPostVariacion
  odometro: z.number().optional(),
  geojson: PuntoGeojsonSchema.optional(),
  direccion: z.string().optional(),
  idSensor: z.number().optional(),
});
export type IEventoCargaCombustible = z.infer<
  typeof EventoCargaCombustibleSchema
>;

export const InformeCargasCombustibleSchema = z.object({
  totalCargas: z.number().optional(),
  totalLitrosCargados: z.number().optional(),
  vehiculosConCarga: z.number().optional(),
  cargas: z.array(EventoCargaCombustibleSchema).optional(),
});
export type IInformeCargasCombustible = z.infer<
  typeof InformeCargasCombustibleSchema
>;

/* ────────────────────────────────────────────────
 *  COMBUSTIBLE — EVENTOS SOSPECHOSOS (DESCARGAS)
 * ────────────────────────────────────────────────*/

export const EventoDescargaCombustibleSchema = z.object({
  idActivo: z.string().optional(),
  nombreActivo: z.string().optional(),
  fecha: z.string().optional(),
  litrosDescargados: z.number().optional(), // |variacionCombustible|
  nivelAntes: z.number().optional(),
  nivelDespues: z.number().optional(), // nivelPostVariacion
  odometro: z.number().optional(),
  geojson: PuntoGeojsonSchema.optional(),
  direccion: z.string().optional(),
  idSensor: z.number().optional(),
});
export type IEventoDescargaCombustible = z.infer<
  typeof EventoDescargaCombustibleSchema
>;

export const InformeEventosSospechososSchema = z.object({
  totalEventos: z.number().optional(),
  totalLitrosDescargados: z.number().optional(),
  vehiculosAfectados: z.number().optional(),
  eventos: z.array(EventoDescargaCombustibleSchema).optional(),
});
export type IInformeEventosSospechosos = z.infer<
  typeof InformeEventosSospechososSchema
>;

/* ────────────────────────────────────────────────
 *  COMBUSTIBLE — MENSUAL DE FLOTA
 * ────────────────────────────────────────────────*/

export const EstadisticaVehiculoCombustibleSchema = z.object({
  idActivo: z.string().optional(),
  nombreActivo: z.string().optional(),
  kmRecorridos: z.number().optional(),
  litrosCargados: z.number().optional(),
  rendimientoL100km: z.number().optional(), // L/100km (null si sin datos de odómetro)
  cantidadCargas: z.number().optional(),
  cantidadEventosSospechosos: z.number().optional(),
});
export type IEstadisticaVehiculoCombustible = z.infer<
  typeof EstadisticaVehiculoCombustibleSchema
>;

export const InformeMensualFlotaCombustibleSchema = z.object({
  totalVehiculos: z.number().optional(),
  kmTotales: z.number().optional(),
  litrosTotales: z.number().optional(),
  rendimientoPromedio: z.number().optional(),
  cantidadCargas: z.number().optional(),
  cantidadEventosSospechosos: z.number().optional(),
  vehiculos: z.array(EstadisticaVehiculoCombustibleSchema).optional(),
});
export type IInformeMensualFlotaCombustible = z.infer<
  typeof InformeMensualFlotaCombustibleSchema
>;

export const ConsumoCombustibleVehiculosSchema = z.object({
  kmRecorridos: z.number().optional(), //km (obtenidos del odómetro de los reportes)
  consumoRuta: z.number().optional(), // litros cada 100 km (ruta) — snapshot del vehículo individual
  consumoCiudad: z.number().optional(), // litros cada 100 km (ciudad) — snapshot del vehículo individual
  consumoEstimado: z.number().optional(), // litros (según km y promedio de consumoRuta/consumoCiudad)
  consumoDeclarado: z.number().optional(), // litros (según lo cargado en los servicios del vehículo)
  consumoReal: z.number().optional(), // litros (según caídas de nivel del sensor, de 'Combustible Horario Vehículos')
  vehiculosConsiderados: z.number().optional(), // Vehículos totales analizados (mínimamente tenían odómetro)
  vehiculosConConsumo: z.number().optional(), // Vehículos que tenían consumo promedio y valores de odómetro
});
export type IConsumoCombustibleVehiculos = z.infer<
  typeof ConsumoCombustibleVehiculosSchema
>;

/* ────────────────────────────────────────────────
 *  GASTOS DEL CLIENTE
 * ────────────────────────────────────────────────*/

/** Cantidad de dispositivos de una categoría (sin costo). */
export const DetalleGastoCategoriaSchema = z.object({
  cantidadTotal: z.number().optional(), // dispositivos totales del cliente (ej. 100)
  cantidadFacturada: z.number().optional(), // los considerados/activos en el período (ej. 10)
});
export type IDetalleGastoCategoria = z.infer<
  typeof DetalleGastoCategoriaSchema
>;

/** Cantidad de dispositivos facturados de una categoría para un hijo. */
export const GastoHijoCategoriaSchema = z.object({
  cantidad: z.number().optional(), // dispositivos facturados del hijo
});
export type IGastoHijoCategoria = z.infer<typeof GastoHijoCategoriaSchema>;

/** Dispositivos que aportó un hijo directo en el período del resumen. */
export const GastoHijoResumenSchema = z.object({
  idCliente: z.string().optional(),
  nombre: z.string().optional(),
  total: z.number().optional(), // suma de cantidades facturadas de las 3 categorías
  // Desglose por categoría (cantidad facturada)
  trackers: GastoHijoCategoriaSchema.optional(),
  alarmas: GastoHijoCategoriaSchema.optional(),
  camaras: GastoHijoCategoriaSchema.optional(),
});
export type IGastoHijoResumen = z.infer<typeof GastoHijoResumenSchema>;

export const ResumenGastosClienteSchema = z.object({
  trackers: DetalleGastoCategoriaSchema.optional(),
  alarmas: DetalleGastoCategoriaSchema.optional(),
  camaras: DetalleGastoCategoriaSchema.optional(),
  total: z.number().optional(), // suma de cantidadFacturada de las 3 categorías (dispositivos)
  /** Desglose por hijo directo (no bonificado, no raíz independiente). */
  hijos: z.array(GastoHijoResumenSchema).optional(),
});
export type IResumenGastosCliente = z.infer<typeof ResumenGastosClienteSchema>;

/* ────────────────────────────────────────────────
 *  MAPA DE TIPO DE RESUMEN
 * ────────────────────────────────────────────────*/

export type MapaResumenDatos = {
  'Consumo Mensual Luminarias': IConsumoMensualLuminarias;
  'Encendido Diario Luminarias': IEncendidoDiarioLuminarias;
  'Informe Diario Luminarias': IInformeDiarioLuminarias;
  'Consumo Mensual Combustible Vehículos': IConsumoCombustibleVehiculos;
  'Temperatura Horaria Vehículos': ITemperaturaHorariaVehiculo;
  'Combustible Horario Vehículos': ICombustibleHorarioVehiculo;
  'Informe Cargas Combustible': IInformeCargasCombustible;
  'Informe Eventos Sospechosos Combustible': IInformeEventosSospechosos;
  'Informe Mensual Flota Combustible': IInformeMensualFlotaCombustible;
  'Gastos del Cliente': IResumenGastosCliente;
};

/* ────────────────────────────────────────────────
 *  BASE DEL RESUMEN (GENÉRICO)
 * ────────────────────────────────────────────────*/

export interface IResumenDatosBase<T extends keyof MapaResumenDatos> {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;

  tipo?: T;
  tipoEntidad?: TipoEntidadResumen;
  resumen?: MapaResumenDatos[T];
  agrupacion?: AgrupacionResumen;
  agrupacionTiempo?: AgrupacionTiempo;
  idsAsignados?: string[];
  periodoInicio?: string;
  periodoFin?: string;
  cerrado?: boolean; //indica que el resumen ya no se va a actualizar más

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

// Campos comunes a todas las variantes (sin tipo/resumen, que discriminan)
const ResumenDatosCamposSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),

  tipoEntidad: TipoEntidadResumenSchema.optional(),
  agrupacion: AgrupacionResumenSchema.optional(),
  agrupacionTiempo: AgrupacionTiempoSchema.optional(),
  idsAsignados: z.array(z.string()).optional(),
  periodoInicio: z.string().optional(),
  periodoFin: z.string().optional(),
  cerrado: z.boolean().optional(), //indica que el resumen ya no se va a actualizar más

  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});

const VarianteConsumoMensualLuminarias = ResumenDatosCamposSchema.extend({
  tipo: z.literal('Consumo Mensual Luminarias').optional(),
  resumen: ConsumoMensualLuminariasSchema.optional(),
});
const VarianteEncendidoDiarioLuminarias = ResumenDatosCamposSchema.extend({
  tipo: z.literal('Encendido Diario Luminarias').optional(),
  resumen: EncendidoDiarioLuminariasSchema.optional(),
});
const VarianteInformeDiarioLuminarias = ResumenDatosCamposSchema.extend({
  tipo: z.literal('Informe Diario Luminarias').optional(),
  resumen: InformeDiarioLuminariasSchema.optional(),
});
const VarianteConsumoMensualCombustibleVehiculos =
  ResumenDatosCamposSchema.extend({
    tipo: z.literal('Consumo Mensual Combustible Vehículos').optional(),
    resumen: ConsumoCombustibleVehiculosSchema.optional(),
  });
const VarianteTemperaturaHorariaVehiculos = ResumenDatosCamposSchema.extend({
  tipo: z.literal('Temperatura Horaria Vehículos').optional(),
  resumen: TemperaturaHorariaVehiculoSchema.optional(),
});
const VarianteCombustibleHorarioVehiculos = ResumenDatosCamposSchema.extend({
  tipo: z.literal('Combustible Horario Vehículos').optional(),
  resumen: CombustibleHorarioVehiculoSchema.optional(),
});
const VarianteInformeCargasCombustible = ResumenDatosCamposSchema.extend({
  tipo: z.literal('Informe Cargas Combustible').optional(),
  resumen: InformeCargasCombustibleSchema.optional(),
});
const VarianteInformeEventosSospechososCombustible =
  ResumenDatosCamposSchema.extend({
    tipo: z.literal('Informe Eventos Sospechosos Combustible').optional(),
    resumen: InformeEventosSospechososSchema.optional(),
  });
const VarianteInformeMensualFlotaCombustible = ResumenDatosCamposSchema.extend(
  {
    tipo: z.literal('Informe Mensual Flota Combustible').optional(),
    resumen: InformeMensualFlotaCombustibleSchema.optional(),
  },
);
const VarianteGastosDelCliente = ResumenDatosCamposSchema.extend({
  tipo: z.literal('Gastos del Cliente').optional(),
  resumen: ResumenGastosClienteSchema.optional(),
});

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO
 * ────────────────────────────────────────────────*/

export const ResumenDatosSchema = z.union([
  VarianteConsumoMensualLuminarias,
  VarianteEncendidoDiarioLuminarias,
  VarianteInformeDiarioLuminarias,
  VarianteConsumoMensualCombustibleVehiculos,
  VarianteTemperaturaHorariaVehiculos,
  VarianteCombustibleHorarioVehiculos,
  VarianteInformeCargasCombustible,
  VarianteInformeEventosSospechososCombustible,
  VarianteInformeMensualFlotaCombustible,
  VarianteGastosDelCliente,
]);
export type IResumenDatos = z.infer<typeof ResumenDatosSchema>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE
 * ────────────────────────────────────────────────*/

const camposOmitidos: { _id: true; cliente: true; ancestros: true } = {
  _id: true,
  cliente: true,
  ancestros: true,
};

export const CreateResumenDatosSchema = z.union([
  VarianteConsumoMensualLuminarias.omit(camposOmitidos),
  VarianteEncendidoDiarioLuminarias.omit(camposOmitidos),
  VarianteInformeDiarioLuminarias.omit(camposOmitidos),
  VarianteConsumoMensualCombustibleVehiculos.omit(camposOmitidos),
  VarianteTemperaturaHorariaVehiculos.omit(camposOmitidos),
  VarianteCombustibleHorarioVehiculos.omit(camposOmitidos),
  VarianteInformeCargasCombustible.omit(camposOmitidos),
  VarianteInformeEventosSospechososCombustible.omit(camposOmitidos),
  VarianteInformeMensualFlotaCombustible.omit(camposOmitidos),
  VarianteGastosDelCliente.omit(camposOmitidos),
]);
export type ICreateResumenDatos = z.infer<typeof CreateResumenDatosSchema>;

export const UpdateResumenDatosSchema = z.union([
  VarianteConsumoMensualLuminarias.omit(camposOmitidos),
  VarianteEncendidoDiarioLuminarias.omit(camposOmitidos),
  VarianteInformeDiarioLuminarias.omit(camposOmitidos),
  VarianteConsumoMensualCombustibleVehiculos.omit(camposOmitidos),
  VarianteTemperaturaHorariaVehiculos.omit(camposOmitidos),
  VarianteCombustibleHorarioVehiculos.omit(camposOmitidos),
  VarianteInformeCargasCombustible.omit(camposOmitidos),
  VarianteInformeEventosSospechososCombustible.omit(camposOmitidos),
  VarianteInformeMensualFlotaCombustible.omit(camposOmitidos),
  VarianteGastosDelCliente.omit(camposOmitidos),
]);
export type IUpdateResumenDatos = z.infer<typeof UpdateResumenDatosSchema>;
