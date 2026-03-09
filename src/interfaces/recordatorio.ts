import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IDocumentacion } from './documentacion';
import { IUsuario } from './usuario';

export type TipoRecordatorio = 'km' | 'fecha';
export type CategoriaRecordatorio = 'Colectivo' | 'Vehiculo';
export type ISubcategoriaRecordatorio =
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
export interface IRecordatorio {
  _id?: string;
  categoria?: CategoriaRecordatorio;
  subcategoria?: ISubcategoriaRecordatorio;
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;
  tipo?: TipoRecordatorio[];
  notificado?: boolean;
  fechaLimite?: string;
  fechaCreacion?: string;
  kmLimite?: number;
  idActivo?: string;
  idDocumentacion?: string;
  detallesDelMantenimiento?: string;
  repetible?: boolean;
  frecuenciaKm?: number;
  frecuenciaDia?: number;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  activo?: IActivo;
  documentacion?: IDocumentacion;
}

type OmitirCreate = '_id' | 'cliente' | 'activo' | 'documentacion' | 'usuario';

export interface ICreateRecordatorio extends Omit<
  Partial<IRecordatorio>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente' | 'activo' | 'documentacion' | 'usuario';

export interface IUpdateRecordatorio extends Omit<
  Partial<IRecordatorio>,
  OmitirUpdate
> {}
