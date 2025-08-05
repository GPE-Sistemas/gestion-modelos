import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IUsuario } from './usuario';

export type TipoDocumentacion = 'Licencia' | 'Seguro';

export interface IDocumentacion {
  _id?: string;
  tipo?: TipoDocumentacion;
  vencimiento?: string;
  fechaCreacion?: string;
  emision?: string;
  descripcion?: string;
  imagenes?: string[];
  idCliente?: string;
  idsAncestros?: string[];
  idChofer?: string;
  idActivo?: string;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  chofer?: IUsuario;
  activo?: IActivo;
}

type OmitirCreate = '_id' | 'chofer' | 'activo' | 'Cliente';

export interface ICreateDocumentacion
  extends Omit<Partial<IDocumentacion>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'chofer' | 'activo' | 'Cliente';

export interface IUpdateDocumentacion
  extends Omit<Partial<IDocumentacion>, OmitirUpdate> {}
