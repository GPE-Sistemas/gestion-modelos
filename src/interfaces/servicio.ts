import { ICoordenadas } from '../auxiliares';
import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IProveedor } from './proveedor';

export type TipoServicio = 'Gasto' | 'Mantenimiento' | 'Combustible';
export type CategoriaServicio = 'Colectivo' | 'Vehiculo';
export type ISubcategoriaServicio =
  | 'Cambio de aceite y filtro'
  | 'Cambio de aceite de caja'
  | 'Cambio de líquido refrigerante'
  | 'Cambio de filtro de combustible'
  | 'Cambio de filtro de aire'
  | 'Cambio de filtro de habitáculo'
  | 'Cambio de batería'
  | 'Cambio de cubiertas'
  | 'Cambio de luces'
  | 'Cambio de líquido de frenos'
  | 'Cambio de pastillas de freno'
  | 'Cambio de bujías'
  | 'Otro';
export interface IServicio {
  _id?: string;
  tipo?: TipoServicio;
  categoria?: CategoriaServicio;
  subcategoria?: ISubcategoriaServicio;
  idCliente?: string;
  idsAncestros?: string[];
  idActivo?: string;
  fechaRealizacion?: string;
  fechaCreacion?: string;
  nombreChofer?: string;
  detalles?: string;
  kmDelMantenimiento?: number;
  costo?: number;
  litrosCargados?: number;
  idProveedor?: string;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  proveedor?: IProveedor;
  activo?: IActivo;
}

type OmitirCreate = '_id' | 'cliente' | 'activo' | 'proveedor';

export interface ICreateServicio extends Omit<
  Partial<IServicio>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente' | 'activo' | 'proveedor';

export interface IUpdateServicio extends Omit<
  Partial<IServicio>,
  OmitirUpdate
> {}
