import { IActivo } from './activo';
import { ICliente } from './cliente';
import { ICronograma } from './cronograma';
import { IRecorrido } from './recorrido';
import { IUsuario } from './usuario';

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
  idActivo?: string;
  idChofer?: string;
  idsRecorridos?: string[];
  idRecorridoActual?: string;
  completado?: boolean; /// Que los datos son iguales al cronograma
  cancelado?: boolean; /// Que el despacho fue cancelado
  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
  activo?: IActivo;
  chofer?: IUsuario;
  recorridos?: IRecorrido[];
  cronograma?: ICronograma;
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'usuario'
  | 'fechaCreacion'
  | 'activo'
  | 'chofer'
  | 'recorridos'
  | 'cronograma';

export interface ICreateDespacho
  extends Omit<Partial<IDespacho>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'usuario'
  | 'fechaCreacion'
  | 'activo'
  | 'chofer'
  | 'recorridos'
  | 'cronograma';

export interface IUpdateDespacho
  extends Omit<Partial<IDespacho>, OmitirUpdate> {}
