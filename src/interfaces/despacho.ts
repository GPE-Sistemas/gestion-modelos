import { ICliente } from './cliente';
import { IUsuario } from './usuario';

export interface IDespacho {
  _id?: string;
  //
  idCliente?: string;
  idUsuario?: string;
  //
  fechaCreacion?: string;
  fecha?: string;
  idCronograma?: string;
  idVehiculo?: string;
  idChofer?: string;
  idsRecorridos?: string[];
  completado?: boolean;
  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
}

type OmitirCreate = '_id' | 'cliente' | 'usuario';

export interface ICreateDespacho
  extends Omit<Partial<IDespacho>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'usuario';

export interface IUpdateDespacho
  extends Omit<Partial<IDespacho>, OmitirUpdate> {}
