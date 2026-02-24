import { IGeoJSON } from '../auxiliares';
import { ICliente } from './cliente';
import { TipoEmergencia } from './emergencias';

/* ────────────────────────────────────────────────
 *  CATEGORÍAS
 * ────────────────────────────────────────────────*/

export type ICategoriaUbicacion =
  | 'Terminal'
  | 'Domicilio'
  | 'Activos'
  | 'Centro de Atención'
  | 'Hospital'
  | 'Destino Emergencia'
  | 'Vehiculos';

/* ────────────────────────────────────────────────
 *  VALORES POR CATEGORÍA
 * ────────────────────────────────────────────────*/

//Por ahora estarán vacíos
export interface IValoresUbicacionTerminal {}

export interface IValoresUbicacionDomicilio {}

export interface IValoresUbicacionActivos {}

export interface IValoresUbicacionDestinoEmergencia {}

export interface IValoresUbicacionVehiculos {}

export interface IValoresUbicacionCentroAtencion {
  telefono?: string;
  email?: string;
  tipoEmergencia?: TipoEmergencia;
  activo?: boolean;
}

export interface IValoresUbicacionHospital {
  telefono?: string;
  email?: string;
  gestion?: 'Público' | 'Privado' | 'Público-privado';
  activo?: boolean;
}

/* ────────────────────────────────────────────────
 *  MAPA CATEGORÍA → VALORES
 * ────────────────────────────────────────────────*/

export type MapaValoresUbicacion = {
  Terminal: IValoresUbicacionTerminal;
  Domicilio: IValoresUbicacionDomicilio;
  Activos: IValoresUbicacionActivos;
  'Centro de Atención': IValoresUbicacionCentroAtencion;
  Hospital: IValoresUbicacionHospital;
  'Destino Emergencia': IValoresUbicacionDestinoEmergencia;
  Vehiculos: IValoresUbicacionVehiculos;
};

/* ────────────────────────────────────────────────
 *  BASE GENÉRICA
 * ────────────────────────────────────────────────*/

export interface IUbicacionBase<T extends keyof MapaValoresUbicacion> {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  identificacion?: string;
  fechaCreacion?: string;
  categoria?: T;
  direccion?: string;
  geojson?: IGeoJSON;
  fotos?: string[];
  color?: string;
  valores?: MapaValoresUbicacion[T];
  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
}

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO - READ
 * ────────────────────────────────────────────────*/

export type IUbicacion =
  | IUbicacionBase<'Terminal'>
  | IUbicacionBase<'Domicilio'>
  | IUbicacionBase<'Activos'>
  | IUbicacionBase<'Centro de Atención'>
  | IUbicacionBase<'Hospital'>
  | IUbicacionBase<'Destino Emergencia'>
  | IUbicacionBase<'Vehiculos'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE
 * ────────────────────────────────────────────────*/

type Omitir = '_id' | 'cliente' | 'ancestros';

export type ICreateUbicacion =
  | Omit<IUbicacionBase<'Terminal'>, Omitir>
  | Omit<IUbicacionBase<'Domicilio'>, Omitir>
  | Omit<IUbicacionBase<'Activos'>, Omitir>
  | Omit<IUbicacionBase<'Centro de Atención'>, Omitir>
  | Omit<IUbicacionBase<'Hospital'>, Omitir>
  | Omit<IUbicacionBase<'Destino Emergencia'>, Omitir>
  | Omit<IUbicacionBase<'Vehiculos'>, Omitir>;

export type IUpdateUbicacion =
  | ({ categoria: 'Terminal' } & Partial<
      Omit<IUbicacionBase<'Terminal'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Domicilio' } & Partial<
      Omit<IUbicacionBase<'Domicilio'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Activos' } & Partial<
      Omit<IUbicacionBase<'Activos'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Centro de Atención' } & Partial<
      Omit<IUbicacionBase<'Centro de Atención'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Hospital' } & Partial<
      Omit<IUbicacionBase<'Hospital'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Destino Emergencia' } & Partial<
      Omit<IUbicacionBase<'Destino Emergencia'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Vehiculos' } & Partial<
      Omit<IUbicacionBase<'Vehiculos'>, Omitir | 'categoria'>
    >);
/* ────────────────────────────────────────────────
 *  CACHE (sin virtuals)
 * ────────────────────────────────────────────────*/

export type IUbicacionCache = Omit<IUbicacion, 'cliente' | 'ancestros'>;
