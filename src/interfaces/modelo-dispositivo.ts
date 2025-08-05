import { ICliente } from './cliente';
import { ICodigosDispositivo, TipoDispositivo } from './codigos-dispositivo';

export interface PotenciasDimerizacionLuminarias {
  dim20?: number;
  dim40?: number;
  dim60?: number;
  dim80?: number;
  dim100?: number;
}
export interface IDetallesLuminarias {
  horasVida?: number;
  potencia?: PotenciasDimerizacionLuminarias;
  voltaje?: number;
}

export interface IModeloDispositivo {
  _id?: string;
  //
  tipo?: TipoDispositivo;
  marca?: string;
  modelo?: string;
  formatoMensaje?: string;
  idCodigos?: string;
  idCliente?: string;
  idsAncestros?: string[];
  //Datos técnicos para luminarias
  luminarias?: IDetallesLuminarias;
  global?: boolean;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  codigos?: ICodigosDispositivo;
}

type OmitirCreate = '_id' | 'codigos' | 'cliente';

export interface ICreateModeloDispositivo
  extends Omit<Partial<IModeloDispositivo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'codigos' | 'cliente';

export interface IUpdateModeloDispositivo
  extends Omit<Partial<IModeloDispositivo>, OmitirUpdate> {}
