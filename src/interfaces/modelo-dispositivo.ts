import { ICliente } from './cliente';
import { ICodigosDispositivo, TipoDispositivo } from './codigos-dispositivo';

export interface IModeloDispositivo {
  _id?: string;
  //
  tipo?: TipoDispositivo;
  marca?: string;
  modelo?: string;
  encabezadoNanocomm?: string;
  idCodigos?: string;
  idCliente?: string;
  // Populate
  cliente?: ICliente;
  codigos?: ICodigosDispositivo;
}

type OmitirCreate = '_id' | 'codigos' | 'cliente';

export interface ICreateModeloDispositivo
  extends Omit<Partial<IModeloDispositivo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'codigos' | 'cliente';

export interface IUpdateModeloDispositivo
  extends Omit<Partial<IModeloDispositivo>, OmitirUpdate> {}
