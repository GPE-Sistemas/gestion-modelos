import { IGeoJSONPoint } from '../auxiliares';
import { ICamara } from './camara';
import { ICliente } from './cliente';
import { IModeloDispositivo } from './modelo-dispositivo';

export type EstadoSirena = 'Online' | 'Offline';

export interface ISirena {
  _id?: string;
  /// Cosas de IRIX
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  idModelo?: string;
  idsAsignados?: string[]; // Camaras, sensores, etc

  // Datos de sincronizacion de seguridad
  idExterno?: string; /// El _id que tiene la sirena en seguridad
  chipId?: string; /// El chipId de la sirena en seguridad
  fechaSincronizacion?: string;
  ubicacion?: IGeoJSONPoint;
  direccion?: string;
  activa?: boolean;
  estado?: EstadoSirena;
  tipo?: string;
  onlineDesde?: string;
  offlineDesde?: string;
  iccidSim?: string;
  telefono?: string;

  /// Populates
  cliente?: ICliente;
  camaras?: ICamara[];
  modelo?: IModeloDispositivo;
}

type Omitir = '_id' | 'cliente' | 'camaras' | 'modelo';

export interface ICreateSirena extends Omit<Partial<ISirena>, Omitir> {}

export interface IUpdateSirena extends Omit<Partial<ISirena>, Omitir> {}
