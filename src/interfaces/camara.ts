import { ICliente } from './cliente';
import { IModeloDispositivo } from './modelo-dispositivo';

export type TipoHabilitacion = 'Siempre' | 'Con Evento';
export type TipoCamara = 'Hikvision' | 'Dahua' | 'Hikvision P2P' | 'Dahua P2P';

export interface ICanalesCamara {
  numero: string; // 1
  ids: {
    id: string;
    width: number;
    height: number;
  }[];
  nombre?: string;
  descripcion?: string;
  tipoHabilitacion?: TipoHabilitacion;
}

export interface ICredencialesDahua {
  acceskeyDahua?: string;
  secretKeyDahua?: string;
  productID?: string;
}

export interface ICamara {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  identificacion?: string;
  canales?: ICanalesCamara[];
  idModeloDispositivo?: string;
  tipo?: TipoCamara;
  numeroSerie?: string;
  host?: string;
  puertoRTSP?: number;
  puertoHTTP?: number;
  usuario?: string;
  password?: string;
  claveDeEncriptacion?: string;
  credencialesDahua?: ICredencialesDahua;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  modeloDispositivo?: IModeloDispositivo;
}

type OmitirCreate = '_id' | 'cliente' | 'modeloDispositivo';

export interface ICreateCamara extends Omit<Partial<ICamara>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'modeloDispositivo';

export interface IUpdateCamara extends Omit<Partial<ICamara>, OmitirUpdate> {}
