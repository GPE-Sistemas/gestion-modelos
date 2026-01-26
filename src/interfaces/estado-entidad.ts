import { ICliente } from './cliente';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export type EstadoHabilitacion = 'Habilitado' | 'Suspendido';

export interface IEstadoEntidad {
  _id?: string;
  fechaCreacion?: string;
  estado?: EstadoHabilitacion;
  idEntidad?: string; /// POR DISPOSITIVO
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;
  nota?: string;
  motivos?: string[];
  vigencia?: string; // Desde cuando se aplica el estado
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  alarma?: IDispositivoAlarma;
  tracker?: ITracker;
}

type Omitir = '_id' | 'cliente' | 'usuario' | 'alarma' | 'tracker';

export interface ICreateEstadoEntidad
  extends Omit<Partial<IEstadoEntidad>, Omitir> {}

export interface IUpdateEstadoEntidad
  extends Omit<Partial<IEstadoEntidad>, Omitir> {}
