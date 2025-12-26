import { IUsuario } from './usuario';
import {
  EstadoEvento,
  EstadoEventoTecnico,
  IEventoGenerico,
} from './evento-generico';

export interface ITratamientoEvento {
  _id?: string;
  //
  nota?: string;
  notaInterna?: string;
  fechaCreacion?: string;
  estado?: EstadoEvento;
  // Separados para no hinche las bolas el overlap.
  estadoTecnico?: EstadoEventoTecnico;
  esperaHasta?: string;
  //
  idsEventos?: string[];
  idUsuario?: string;
  // Populate
  eventos?: IEventoGenerico[];
  usuario?: IUsuario;
}

type OmitirCreate = '_id' | 'eventos' | 'usuario';

export interface ICreateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'eventos' | 'usuario';

export interface IUpdateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirUpdate> {}
