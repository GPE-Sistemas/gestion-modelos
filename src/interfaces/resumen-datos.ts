import { ICliente } from './cliente';
export type AgrupacionTiempo = 'Diario' | 'Semanal' | 'Mensual' | 'Anual';
export type AgrupacionResumen = 'Cliente' | 'Grupo' | 'Individual';
export type TipoResumenDatos = 'Consumo Mensual Luminarias';

/* ────────────────────────────────────────────────
 *  RESÚMENES
 * ────────────────────────────────────────────────*/

export interface IConsumoMensualLuminarias {
  consumoTotal: number;
  totalDispositivos: number;
}

export interface IEncendidoDiarioLuminarias {
  tiempoEncendidoTotal: number;
  totalDispositivos: number;
  tiempoEncendidoPromedio: number;
}

/* ────────────────────────────────────────────────
 *  MAPA DE TIPO DE RESUMEN
 * ────────────────────────────────────────────────*/

export type MapaResumenDatos = {
  'Consumo Mensual Luminarias': IConsumoMensualLuminarias;
  'Encendido Diario Luminarias': IEncendidoDiarioLuminarias;
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
  | IResumenDatosBase<'Encendido Diario Luminarias'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE
 * ────────────────────────────────────────────────*/

type OmitirCreate = '_id' | 'cliente' | 'ancestros';

export type ICreateResumenDatos =
  | Omit<Partial<IResumenDatosBase<'Consumo Mensual Luminarias'>>, OmitirCreate>
  | Omit<
      Partial<IResumenDatosBase<'Encendido Diario Luminarias'>>,
      OmitirCreate
    >;

type OmitirUpdate = '_id' | 'cliente' | 'ancestros';

export type IUpdateResumenDatos =
  | Omit<Partial<IResumenDatosBase<'Consumo Mensual Luminarias'>>, OmitirUpdate>
  | Omit<
      Partial<IResumenDatosBase<'Encendido Diario Luminarias'>>,
      OmitirUpdate
    >;
