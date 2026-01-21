import { ICliente } from './cliente';
export type AgrupacionTiempo = 'Diario' | 'Semanal' | 'Mensual' | 'Anual';
export type AgrupacionResumen = 'Cliente' | 'Grupo' | 'Individual';
export type TipoResumenDatos = 'Consumo Mensual Luminarias';

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

export interface IConsumoCombustibleVehiculos {
  kmRecorridos?: number; //km (obtenidos del odómetro de los reportes)
  consumoPromedio?: number; //litros cada 100 km (sólo para vehículo individual)
  consumoEstimado?: number; // litros (según km recorridos y consumo promedio)
  consumoDeclarado?: number; // litros (según lo cargado en los servicios del vehículo)
  vehiculosConsiderados?: number; // Vehículos totales analizados (mínimamente tenían odómetro)
  vehiculosConConsumo?: number; // Vehículos que tenían consumo promedio y valores de odómetro
}
/* ────────────────────────────────────────────────
 *  MAPA DE TIPO DE RESUMEN
 * ────────────────────────────────────────────────*/

export type MapaResumenDatos = {
  'Consumo Mensual Luminarias': IConsumoMensualLuminarias;
  'Encendido Diario Luminarias': IEncendidoDiarioLuminarias;
  'Consumo Mensual Combustible Vehículos': IConsumoCombustibleVehiculos;
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
  | IResumenDatosBase<'Consumo Mensual Combustible Vehículos'>;

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
  | Omit<
      Partial<IResumenDatosBase<'Consumo Mensual Combustible Vehículos'>>,
      OmitirCreate
    >;

type OmitirUpdate = '_id' | 'cliente' | 'ancestros';

export type IUpdateResumenDatos =
  | Omit<Partial<IResumenDatosBase<'Consumo Mensual Luminarias'>>, OmitirUpdate>
  | Omit<
      Partial<IResumenDatosBase<'Encendido Diario Luminarias'>>,
      OmitirUpdate
    >
  | Omit<
      Partial<IResumenDatosBase<'Consumo Mensual Combustible Vehículos'>>,
      OmitirUpdate
    >;
