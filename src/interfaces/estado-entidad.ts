import { ICliente } from './cliente';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type estadoCuenta = 'Habilitado' | 'Suspendido';

export interface IEstadoEntidad {
  _id?: string;
  fechaCreacion?: string;
  estado?: estadoCuenta;
  idEntidad?: string; /// POR DISPOSITIVO
  idCliente?: string;
  idUsuario?: string;
  nota?: string;
  motivos?: string[];
  vigencia?: string; // Desde cuando se aplica el estado
  // Populate
  cliente?: ICliente;
  usuario?: IUsuario;
  alarma?: IDispositivoAlarma;
  tracker?: ITracker;
}

type Omitir = '_id' | 'cliente' | 'usuario' | 'alarma' | 'tracker';

export interface ICreateEstadoCuenta
  extends Omit<Partial<IEstadoEntidad>, Omitir> {}

export interface IUpdateEstadoCuenta
  extends Omit<Partial<IEstadoEntidad>, Omitir> {}
