import { IUsuario } from "./usuario";
import { estadoEvento, IEvento } from "./evento";

export interface ITratamientoEvento {
  _id?: string;
  //
  nota?: string;
  notaInterna?: string;
  fechaCreacion?: string;
  estado?: estadoEvento;
  //
  idEvento?: string;
  idUsuario?: string;
  // Populate
  evento?: IEvento;
  usuario?: IUsuario;
}

type OmitirCreate = "_id" | "evento" | "usuario";

export interface ICreateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "evento" | "usuario";

export interface IUpdateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirUpdate> {}
