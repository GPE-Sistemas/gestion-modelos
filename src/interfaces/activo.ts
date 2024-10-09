import { ICliente } from './cliente';
import { IFlota } from './flota';
import { IRecorrido } from './recorrido';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type TipoVehiculo =
  | 'Colectivo'
  | 'Policia'
  | 'Ambulancia'
  | 'Bomberos'
  | 'Particular'
  | 'Camion'
  | 'Moto'
  | 'Otro';

export type EstadoVehiculo =
  | 'Operativo'
  | 'En mantenimiento'
  | 'Fuera de servicio';

export type ICategoriaActivo = 'Normal' | 'Vehículo';

export interface IVehiculo {
  tipo?: TipoVehiculo;
  patente?: string;
  estado?: EstadoVehiculo;
  //
  idChofer?: string;
  idRecorrido?: string;
  idsRecorridos?: string[];
  /**
   * El id del tracker asignado en la plataforma traccar para obtener el vehiculo rapido con los reportes de traccar
   */
  idUnicoTraccar?: number;
  // Populate
  chofer?: IUsuario;
  recorrido?: IRecorrido;
  recorridos?: IRecorrido[];
}

export interface IActivo {
  _id?: string;
  //
  idCliente?: string;
  idFlota?: string;
  idTracker?: string;
  identificacion?: string;
  categoria?: ICategoriaActivo;
  vehiculo?: IVehiculo;
  // Populate
  cliente?: ICliente;
  tracker?: ITracker;
  flota?: IFlota;
}

type OmitirCreate = '_id' | 'cliente' | 'tracker';

export interface ICreateActivo extends Omit<Partial<IActivo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'tracker';

export interface IUpdateActivo extends Omit<Partial<IActivo>, OmitirUpdate> {}
