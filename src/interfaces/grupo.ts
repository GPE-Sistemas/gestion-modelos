import { ICliente } from "./cliente";

export type CategoriaGrupo = "Línea de colectivo" | "Flota" | "Normal";

export interface IGrupo {
  _id?: string;
  idCliente?: string;
  nombre?: string;
  color?: string;
  categoria?: CategoriaGrupo;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateGrupo extends Omit<Partial<IGrupo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateGrupo extends Omit<Partial<IGrupo>, OmitirUpdate> {}
