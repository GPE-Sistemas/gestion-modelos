import { ICliente } from "./cliente";

export type SonidoEvento = "Silencio" | "Campana" | "Sirena";
export type TipoCategoria =
  | "Activo"
  | "Vehiculo"
  | "Alarma"
  | "Luminaria"
  | "Sistema"
  | "Otro";

export interface ICategoriaEvento {
  _id?: string;
  //
  nombre?: string; // BUR
  prioridad?: number; // 100
  color?: string;
  notificar?: boolean;
  atender?: boolean;
  noDerivar?: boolean;
  sonido?: SonidoEvento;
  modulo?: TipoCategoria;
  idCliente?: string;
  idsAncestros?: string[];
  default?: boolean;
  global?: boolean;
  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateCategoriaEvento
  extends Omit<Partial<ICategoriaEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateCategoriaEvento
  extends Omit<Partial<ICategoriaEvento>, OmitirUpdate> {}

export interface ICategoriaEventoCache
  extends Omit<ICategoriaEvento, "cliente" | "ancestros"> {}
