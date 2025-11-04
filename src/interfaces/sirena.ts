import { ICamara } from './camara';
import { ICliente } from './cliente';

export interface ISirena {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  idExterno?: string; /// El _id que tiene la sirena en seguridad
  idsAsignados?: string[]; // Camaras, sensores, etc

  /// Populates
  cliente?: ICliente;
  camaras?: ICamara[];
}

type Omitir = '_id' | 'cliente' | 'camaras';

export interface ICreateSirena extends Omit<Partial<ISirena>, Omitir> {}

export interface IUpdateSirena extends Omit<Partial<ISirena>, Omitir> {}
