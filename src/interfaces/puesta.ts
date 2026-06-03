import { IGeoJSONPoint } from '../auxiliares';
import { ICliente } from './cliente';
import { IConfigPerfil } from './config-perfil';
import { IGrupo } from './grupo';
import { ILuminaria } from './luminaria';

/**
 * Puesta = soporte físico / punto de luz del alumbrado (columna, poste, ménsula de fachada, colgante).
 * Agrupa 1..N luminarias y porta la georreferencia.
 *
 * Es OPCIONAL en el sistema: solo se usa para clientes con
 * `cliente.config.moduloLuminarias.usaPuestas`. La luminaria adquiere la `ubicacion` desde su puesta.
 */
export interface IPuesta {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;

  identificacion?: string;
  ubicacion?: IGeoJSONPoint; // fuente de verdad de la georreferencia, es la que adquieren las luminarias asignadas a esta puesta
  direccion?: string;

  idsGrupos?: string[];
  idsPerfilConfig?: string[]; // Perfil(es) a nivel puesta

  // Virtuals
  luminarias?: ILuminaria[]; // luminaria.idPuesta == puesta._id
  grupos?: IGrupo[];
  perfilConfigs?: IConfigPerfil[];
  cliente?: ICliente;
  ancestros?: ICliente[];
}

////// CREATE
type OmitirCreate =
  | '_id'
  | 'fechaCreacion'
  | 'idsAncestros'
  | 'luminarias'
  | 'grupos'
  | 'perfilConfigs'
  | 'cliente'
  | 'ancestros';

export interface ICreatePuesta extends Omit<Partial<IPuesta>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'idsAncestros'
  | 'luminarias'
  | 'grupos'
  | 'perfilConfigs'
  | 'cliente'
  | 'ancestros';

export interface IUpdatePuesta extends Omit<Partial<IPuesta>, OmitirUpdate> {}
