import { ICliente } from './cliente';
import { IModoDesactivado } from './dispositivo-alarma';
import { estadoCuenta } from './estado-entidad';
import { IGrupo } from './grupo';
import { IRecorrido } from './recorrido';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type TipoVehiculo =
  | 'Auto'
  | 'Camion'
  | 'Camioneta'
  | 'Colectivo'
  | 'Grua'
  | 'Moto'
  | 'Otro';

export type FuncionActivo =
  | 'Ambulancia'
  | 'Bomberos'
  | 'Mantenimiento'
  | 'Particular'
  | 'Policia'
  | 'Seguridad Privada'
  | 'Servicio Técnico'
  | 'Transporte'
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
  modelo?: string;
  marca?: string;
  anio?: string;
  //
  idChofer?: string;
  idRecorrido?: string;
  idsRecorridos?: string[];
  dentroDelRecorrido?: boolean; // Para seguir el estado de los eventos
  ignicion?: boolean;
  //
  idExterno?: string;
  // Populate
  chofer?: IUsuario;
  recorrido?: IRecorrido;
  recorridos?: IRecorrido[];
}

export interface IVehiculoCache
  extends Omit<IVehiculo, 'chofer' | 'recorrido' | 'recorridos'> {}

export interface IActivo {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  idGrupo?: string;
  idTracker?: string;
  ///alta de activo
  fechaAlta?: string;
  imagenes?: string[];
  identificacion?: string;
  categoria?: ICategoriaActivo;
  funcion?: FuncionActivo;
  vehiculo?: IVehiculo;
  idsClientesQuePuedenAtender?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  modoDesactivado?: IModoDesactivado;

  estadoCuenta?: estadoCuenta;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  tracker?: ITracker;
  grupo?: IGrupo;
}

type OmitirCreate = '_id' | 'cliente' | 'tracker';

export interface ICreateActivo extends Omit<Partial<IActivo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'tracker';

export interface IUpdateActivo extends Omit<Partial<IActivo>, OmitirUpdate> {}

export interface IActivoCache
  extends Omit<
    IActivo,
    'cliente' | 'ancestros' | 'tracker' | 'grupo' | 'vehiculo'
  > {
  vehiculo?: IVehiculoCache;
}
