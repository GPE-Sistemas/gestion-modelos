import { ICliente } from './cliente';
import { ICronograma } from './cronograma';
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
  hora?: string; // Sale
  salio?: string; // Salió
  idCronograma?: string;
  idVehiculo?: string;
  idChofer?: string;
  idsRecorridos?: string[];
  completado?: boolean; /// Que los datos son iguales al cronograma
  cancelado?: boolean; /// Que el despacho fue cancelado
  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
  vehiculo?: IVehiculo;
  chofer?: IUsuario;
  recorridos?: IRecorrido[];
  cronograma?: ICronograma;
}

type OmitirCreate = '_id' | 'cliente' | 'usuario' | 'fechaCreacion';

export interface ICreateDespacho
  extends Omit<Partial<IDespacho>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'usuario' | 'fechaCreacion';

export interface IUpdateDespacho
  extends Omit<Partial<IDespacho>, OmitirUpdate> {}
