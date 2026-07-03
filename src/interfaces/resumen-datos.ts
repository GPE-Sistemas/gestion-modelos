import { ICliente } from './cliente';

export type AgrupacionTiempo =
  | 'Diario'
  | 'Semanal'
  | 'Mensual'
  | 'Anual'
  | 'Horario';
export type AgrupacionResumen = 'Cliente' | 'Grupo' | 'Individual';
export type TipoResumenDatos =
  | 'Consumo Mensual Luminarias'
  | 'Encendido Diario Luminarias'
  | 'Informe Diario Luminarias'
  | 'Consumo Mensual Combustible Vehículos'
  | 'Temperatura Horaria Vehículos'
  | 'Combustible Horario Vehículos'
  | 'Informe Cargas Combustible'
  | 'Informe Eventos Sospechosos Combustible'
  | 'Informe Mensual Flota Combustible'
  | 'Gastos del Cliente';
export type TipoEntidadResumen = 'Luminaria' | 'Puesta' | 'Vehículo' | 'Alarma';
export type MonedaResumen = 'ARS' | 'USD';
/* ────────────────────────────────────────────────
 *  RESÚMENES
 * ────────────────────────────────────────────────*/

export interface IConsumoMensualLuminarias {
  consumoTotal?: number;
  totalDispositivos?: number;
}

export interface IEncendidoDiarioLuminarias {
  tiempoEncendidoTotal?: number;
  totalDispositivos?: number;
  tiempoEncendidoPromedio?: number;
}

export interface IInformeDiarioLuminarias {
  // Generales
  totalLuminarias?: number;

  // Encendido / Apagado (de ultimoReportePeriodico.valores.turnOnOffStatus)
  luminariasEncendidas?: number;
  luminariasApagadas?: number;
  sinDatoEncendido?: number; // Sin reporte periódico reciente

  // Conectividad (fechaUltimaComunicacion dentro de las últimas 24h)
  luminariasConectadas?: number;
  luminariasDesconectadas?: number;

  // Estado operativo (campo `estado` de la luminaria)
  luminariasOperativas?: number;
  luminariasEnMantenimiento?: number;
  sinEstado?: number; // Sin campo `estado` asignado

  // Consumo energético del día en kWh (reservado para implementación futura)
  consumoTotal?: number;

  // Alertas (de ultimoReportePeriodico.valores.alarmas)
  luminariasConAlarmas?: number;
  tiposAlarmas?: Record<string, number>; // { 'Sobre voltaje': 2, 'Fallo LED': 1 }

  // Cortes de energía (luminarias GPE con energiaExterna === false en último reporte)
  luminariasConCortesEnergia?: number;
}

export interface ITemperaturaHorariaVehiculo {
  temperaturaPromedio?: number; // °C promedio de la hora
  temperaturaMin?: number; // °C mínima de la hora
  temperaturaMax?: number; // °C máxima de la hora
  cantidadReportes?: number; // cantidad de reportes procesados
}

export interface ICombustibleHorarioVehiculo {
  // Total (suma de sensores conectados)
  nivelPromedio?: number; // nivel promedio de la hora
  nivelMin?: number; // nivel mínimo de la hora
  nivelMax?: number; // nivel máximo de la hora
  // Por sensor (1-4). Se omiten si el sensor no reportó en la hora.
  nivelPromedio1?: number;
  nivelMin1?: number;
  nivelMax1?: number;
  nivelPromedio2?: number;
  nivelMin2?: number;
  nivelMax2?: number;
  nivelPromedio3?: number;
  nivelMin3?: number;
  nivelMax3?: number;
  nivelPromedio4?: number;
  nivelMin4?: number;
  nivelMax4?: number;
  cantidadReportes?: number; // cantidad de reportes procesados (del Total)
}

/* ────────────────────────────────────────────────
 *  COMBUSTIBLE — CARGAS
 * ────────────────────────────────────────────────*/

export interface IEventoCargaCombustible {
  idActivo?: string;
  nombreActivo?: string;
  fecha?: string; // ISO timestamp del evento
  litrosCargados?: number; // variacionCombustible (positivo)
  nivelPostCarga?: number; // nivelPostVariacion
  odometro?: number;
  geojson?: { type: 'Point'; coordinates: [number, number] };
  direccion?: string;
  idSensor?: number;
}

export interface IInformeCargasCombustible {
  totalCargas?: number;
  totalLitrosCargados?: number;
  vehiculosConCarga?: number;
  cargas?: IEventoCargaCombustible[];
}

/* ────────────────────────────────────────────────
 *  COMBUSTIBLE — EVENTOS SOSPECHOSOS (DESCARGAS)
 * ────────────────────────────────────────────────*/

export interface IEventoDescargaCombustible {
  idActivo?: string;
  nombreActivo?: string;
  fecha?: string;
  litrosDescargados?: number; // |variacionCombustible|
  nivelAntes?: number;
  nivelDespues?: number; // nivelPostVariacion
  odometro?: number;
  geojson?: { type: 'Point'; coordinates: [number, number] };
  direccion?: string;
  idSensor?: number;
}

export interface IInformeEventosSospechosos {
  totalEventos?: number;
  totalLitrosDescargados?: number;
  vehiculosAfectados?: number;
  eventos?: IEventoDescargaCombustible[];
}

/* ────────────────────────────────────────────────
 *  COMBUSTIBLE — MENSUAL DE FLOTA
 * ────────────────────────────────────────────────*/

export interface IEstadisticaVehiculoCombustible {
  idActivo?: string;
  nombreActivo?: string;
  kmRecorridos?: number;
  litrosCargados?: number;
  rendimientoL100km?: number; // L/100km (null si sin datos de odómetro)
  cantidadCargas?: number;
  cantidadEventosSospechosos?: number;
}

export interface IInformeMensualFlotaCombustible {
  totalVehiculos?: number;
  kmTotales?: number;
  litrosTotales?: number;
  rendimientoPromedio?: number;
  cantidadCargas?: number;
  cantidadEventosSospechosos?: number;
  vehiculos?: IEstadisticaVehiculoCombustible[];
}

export interface IConsumoCombustibleVehiculos {
  kmRecorridos?: number; //km (obtenidos del odómetro de los reportes)
  consumoRuta?: number; // litros cada 100 km (ruta) — snapshot del vehículo individual
  consumoCiudad?: number; // litros cada 100 km (ciudad) — snapshot del vehículo individual
  consumoEstimado?: number; // litros (según km y promedio de consumoRuta/consumoCiudad)
  consumoDeclarado?: number; // litros (según lo cargado en los servicios del vehículo)
  vehiculosConsiderados?: number; // Vehículos totales analizados (mínimamente tenían odómetro)
  vehiculosConConsumo?: number; // Vehículos que tenían consumo promedio y valores de odómetro
}
/* ────────────────────────────────────────────────
 *  GASTOS DEL CLIENTE
 * ────────────────────────────────────────────────*/

/** Gasto facturado de una categoría de dispositivos. */
export interface IDetalleGastoCategoria {
  cantidadTotal?: number; // dispositivos totales del cliente (ej. 100)
  cantidadFacturada?: number; // los considerados en la cotización (ej. 10)
}

/** Gasto facturado de una categoría para un hijo (cantidad + subtotal). */
export interface IGastoHijoCategoria {
  cantidad?: number; // dispositivos facturados del hijo
}

/** Gasto que generó un hijo directo en el período del resumen. */
export interface IGastoHijoResumen {
  idCliente?: string;
  nombre?: string;
  total?: number;
  // Desglose por categoría (cantidad facturada y subtotal)
  trackers?: IGastoHijoCategoria;
  alarmas?: IGastoHijoCategoria;
  camaras?: IGastoHijoCategoria;
}

export interface IResumenGastosCliente {
  trackers?: IDetalleGastoCategoria;
  alarmas?: IDetalleGastoCategoria;
  camaras?: IDetalleGastoCategoria;
  total?: number; // suma de los subtotales de las 3 categorías
  /** Desglose por hijo directo (no bonificado, no raíz independiente). */
  hijos?: IGastoHijoResumen[];
}

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

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO
 * ────────────────────────────────────────────────*/

export type IResumenDatos =
  | IResumenDatosBase<'Consumo Mensual Luminarias'>
  | IResumenDatosBase<'Encendido Diario Luminarias'>
  | IResumenDatosBase<'Informe Diario Luminarias'>
  | IResumenDatosBase<'Consumo Mensual Combustible Vehículos'>
  | IResumenDatosBase<'Temperatura Horaria Vehículos'>
  | IResumenDatosBase<'Combustible Horario Vehículos'>
  | IResumenDatosBase<'Informe Cargas Combustible'>
  | IResumenDatosBase<'Informe Eventos Sospechosos Combustible'>
  | IResumenDatosBase<'Informe Mensual Flota Combustible'>
  | IResumenDatosBase<'Gastos del Cliente'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE
 * ────────────────────────────────────────────────*/

type OmitirCreate = '_id' | 'cliente' | 'ancestros';

export type ICreateResumenDatos =
  | Omit<Partial<IResumenDatosBase<'Consumo Mensual Luminarias'>>, OmitirCreate>
  | Omit<
      Partial<IResumenDatosBase<'Encendido Diario Luminarias'>>,
      OmitirCreate
    >
  | Omit<Partial<IResumenDatosBase<'Informe Diario Luminarias'>>, OmitirCreate>
  | Omit<
      Partial<IResumenDatosBase<'Consumo Mensual Combustible Vehículos'>>,
      OmitirCreate
    >
  | Omit<
      Partial<IResumenDatosBase<'Temperatura Horaria Vehículos'>>,
      OmitirCreate
    >
  | Omit<
      Partial<IResumenDatosBase<'Combustible Horario Vehículos'>>,
      OmitirCreate
    >
  | Omit<Partial<IResumenDatosBase<'Informe Cargas Combustible'>>, OmitirCreate>
  | Omit<
      Partial<IResumenDatosBase<'Informe Eventos Sospechosos Combustible'>>,
      OmitirCreate
    >
  | Omit<
      Partial<IResumenDatosBase<'Informe Mensual Flota Combustible'>>,
      OmitirCreate
    >
  | Omit<Partial<IResumenDatosBase<'Gastos del Cliente'>>, OmitirCreate>;

type OmitirUpdate = '_id' | 'cliente' | 'ancestros';

export type IUpdateResumenDatos =
  | Omit<Partial<IResumenDatosBase<'Consumo Mensual Luminarias'>>, OmitirUpdate>
  | Omit<
      Partial<IResumenDatosBase<'Encendido Diario Luminarias'>>,
      OmitirUpdate
    >
  | Omit<Partial<IResumenDatosBase<'Informe Diario Luminarias'>>, OmitirUpdate>
  | Omit<
      Partial<IResumenDatosBase<'Consumo Mensual Combustible Vehículos'>>,
      OmitirUpdate
    >
  | Omit<
      Partial<IResumenDatosBase<'Temperatura Horaria Vehículos'>>,
      OmitirUpdate
    >
  | Omit<
      Partial<IResumenDatosBase<'Combustible Horario Vehículos'>>,
      OmitirUpdate
    >
  | Omit<Partial<IResumenDatosBase<'Informe Cargas Combustible'>>, OmitirUpdate>
  | Omit<
      Partial<IResumenDatosBase<'Informe Eventos Sospechosos Combustible'>>,
      OmitirUpdate
    >
  | Omit<
      Partial<IResumenDatosBase<'Informe Mensual Flota Combustible'>>,
      OmitirUpdate
    >
  | Omit<Partial<IResumenDatosBase<'Gastos del Cliente'>>, OmitirUpdate>;
