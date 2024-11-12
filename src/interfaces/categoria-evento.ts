import { ICliente } from "./cliente";

export type SonidoEvento = "Silencio" | "Campana" | "Sirena";

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
  idCliente?: string;
  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateCategoriaEvento
  extends Omit<Partial<ICategoriaEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateCategoriaEvento
  extends Omit<Partial<ICategoriaEvento>, OmitirUpdate> {}
