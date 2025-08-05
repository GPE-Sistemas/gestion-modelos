import { ICliente } from './cliente';
import {
  IConfigDispositivoLuminaria,
  IDispositivoLorawan,
} from './dispositivo-lorawan';

export interface IConfigDispositivo {
  // Info autogenerada
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  // Info de carga
  fechaCreacion?: string; // Default: Date.now
  fechaAplicacion?: string;
  deveui?: string;
  config?: IConfigDispositivoLuminaria;
  // Virtuals
  dispositivo?: IDispositivoLorawan;
  cliente?: ICliente;
  ancestros?: ICliente[];
}

// CREATE
type OmitirCreate = '_id' | 'fechaCreacion' | 'dispositivo' | 'cliente';
export interface ICreateConfigDispositivo
  extends Omit<Partial<IConfigDispositivo>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = '_id' | 'fechaCreacion' | 'dispositivo' | 'cliente';
export interface IUpdateConfigDispositivo
  extends Omit<Partial<IConfigDispositivo>, OmitirUpdate> {}
