import { IActivo } from './activo';
import { ICliente } from './cliente';

export interface ILogTrackeo {
  _id?: string;
  //
  idCliente?: string;
  idActivo?: string;
  fecha?: string;
  nuevaParada?: boolean;
  indexUltimaParada?: number;
  indexParadaActual?: number;
  ultimaParada?: string;
  paradaActual?: string;
  totalParadas?: number;
  motivo?: string;

  // Populate
  cliente?: ICliente;
  activo?: IActivo;
}

type OmitirCreate = '_id' | 'cliente' | 'activo';

export interface ICreateLogTrackeo
  extends Omit<Partial<ILogTrackeo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'activo';

export interface IUpdateLogTrackeo
  extends Omit<Partial<ILogTrackeo>, OmitirUpdate> {}
