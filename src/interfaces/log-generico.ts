import { ICliente } from './cliente';

export type TipoEntidadLog =
  | 'Luminaria'
  | 'Colectivo'
  | 'Activo'
  | 'Tracker'
  | 'Vehiculo';
/* ────────────────────────────────────────────────
 *  REPORTES POR TIPO
 * ────────────────────────────────────────────────*/
export type ILogGenerico = ILogBase<'Log Mensaje'>;

export interface ILogMensaje {
  mensaje?: string;
  protocolo?: 'UDP' | 'TCP';
  origen?: string;
  puerto?: number;
}

export type MapaValoresLog = {
  'Log Mensaje': ILogMensaje;
};

export type TipoLogs = 'Log Mensaje';

export interface ILogBase<T extends keyof MapaValoresLog> {
  _id: string;
  fechaCreacion?: string;
  idCliente?: string;
  expireAt?: string;
  //
  idsAncestros?: string[];
  tipoEntidad?: TipoEntidadLog;
  tipoReporte?: T;
  valores?: MapaValoresLog[T];
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

////// CREATE
type Omitir = '_id' | 'idsAncestros' | 'cliente' | 'ancestros';
export type ICreateLog = Omit<ILogBase<'Log Mensaje'>, Omitir>;

////// UPDATE
export type IUpdateLog = Omit<Partial<ILogBase<'Log Mensaje'>>, Omitir>;
