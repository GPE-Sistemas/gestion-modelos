import { IUsuario } from "./usuario";
import { estadoEvento, IEvento } from "./evento";
import { estadoEventoTecnico } from "./evento-tecnico";

export interface ITratamientoEvento {
  _id?: string;
  //
  nota?: string;
  notaInterna?: string;
  fechaCreacion?: string;
  estado?: estadoEvento;
  // Separados para no hinche las bolas el overlap.
  estadoTecnico?: estadoEventoTecnico;
  esperaHasta?: string;
  //
  idsEventos?: string[];
  idUsuario?: string;
  // Populate
  eventos?: IEvento[];
  usuario?: IUsuario;
}

type OmitirCreate = "_id" | "eventos" | "usuario";

export interface ICreateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirCreate> {}

type OmitirUpdate = "_id" | "eventos" | "usuario";

export interface IUpdateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirUpdate> {}
