import { ICoordenadas } from '../auxiliares';
import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IProveedor } from './proveedor';

export type TipoServicio = 'Gasto' | 'Mantenimiento';
export type CategoriaServicio = 'Colectivo' | 'Vehiculo';
export interface IServicio {
  _id?: string;
  tipo?: TipoServicio;
  categoria?: CategoriaServicio;
  idCliente?: string;
  idsAncestros?: string[];
  idActivo?: string;
  fechaRealizacion?: string;
  fechaCreacion?: string;
  nombreChofer?: string;
  detalles?: string;
  kmDelMantenimiento?: number;
  costo?: number;
  idProveedor?: string;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  proveedor?: IProveedor;
  activo?: IActivo;
}

type OmitirCreate = '_id' | 'cliente' | 'activo' | 'proveedor';

export interface ICreateServicio
  extends Omit<Partial<IServicio>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'activo' | 'proveedor';

export interface IUpdateServicio
  extends Omit<Partial<IServicio>, OmitirUpdate> {}
