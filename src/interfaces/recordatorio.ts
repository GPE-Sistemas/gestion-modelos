import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IDocumentacion } from './documentacion';
import { IUsuario } from './usuario';

export type TipoRecordatorio = 'km' | 'fecha';

export interface IRecordatorio {
  _id?: string;
  idCliente?: string;
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
  frecuencia?: number;

  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
  activo?: IActivo;
  documentacion?: IDocumentacion;
}

type OmitirCreate = '_id' | 'cliente' | 'activo' | 'documentacion' | 'usuario';

export interface ICreateRecordatorio
  extends Omit<Partial<IRecordatorio>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'activo' | 'documentacion' | 'usuario';

export interface IUpdateRecordatorio
  extends Omit<Partial<IRecordatorio>, OmitirUpdate> {}
