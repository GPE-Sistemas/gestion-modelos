import { ICliente } from './cliente';
import { IConfigPerfil } from './config-perfil';

export type CategoriaGrupo =
  | 'Línea de colectivo'
  | 'Flota'
  | 'Activo'
  | 'Normal'
  | 'Luminaria';

export interface IGrupo {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  nombre?: string;
  color?: string;
  categoria?: CategoriaGrupo;
  idsPerfilConfig?: string[];

  // Integracion Soflex
  fleetId?: string;
  parentFleetId?: string;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  perfilConfigs?: IConfigPerfil[];
}

type OmitirCreate = '_id' | 'cliente';

export interface ICreateGrupo extends Omit<Partial<IGrupo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente';

export interface IUpdateGrupo extends Omit<Partial<IGrupo>, OmitirUpdate> {}
