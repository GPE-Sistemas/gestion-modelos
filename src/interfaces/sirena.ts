import { ICamara } from './camara';
import { ICliente } from './cliente';
import { IModeloDispositivo } from './modelo-dispositivo';

export interface ISirena {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  idExterno?: string; /// El _id que tiene la sirena en seguridad
  chipId?: string; /// El chipId de la sirena en seguridad
  idsAsignados?: string[]; // Camaras, sensores, etc

  /// Cosas rancias de IRIX
  idModelo?: string;

  /// Populates
  cliente?: ICliente;
  camaras?: ICamara[];
  modelo?: IModeloDispositivo;
}

type Omitir = '_id' | 'cliente' | 'camaras' | 'modelo';

export interface ICreateSirena extends Omit<Partial<ISirena>, Omitir> {}

export interface IUpdateSirena extends Omit<Partial<ISirena>, Omitir> {}
