import { ICliente } from './cliente';
import { IRecorrido } from './recorrido';
import { IUsuario } from './usuario';
import { IVehiculo } from './vehiculo';

export interface IDespacho {
  _id?: string;
  //
  idCliente?: string;
  idUsuario?: string;
  //
  fechaCreacion?: string;
  fecha?: string;
  hora?: string;
  idCronograma?: string;
  idVehiculo?: string;
  idChofer?: string;
  idsRecorridos?: string[];
  completado?: boolean;
  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
  vehiculo?: IVehiculo;
  chofer?: IUsuario;
  recorridos?: IRecorrido[];
}

type OmitirCreate = '_id' | 'cliente' | 'usuario' | 'fechaCreacion';

export interface ICreateDespacho
  extends Omit<Partial<IDespacho>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'usuario' | 'fechaCreacion';

export interface IUpdateDespacho
  extends Omit<Partial<IDespacho>, OmitirUpdate> {}
