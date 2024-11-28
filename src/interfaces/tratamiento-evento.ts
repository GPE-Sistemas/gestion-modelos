import { IUsuario } from './usuario';
import { estadoEvento, IEvento } from './evento';
import { estadoEventoTecnico } from './evento-tecnico';

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
  idEvento?: string;
  idUsuario?: string;
  // Populate
  evento?: IEvento;
  usuario?: IUsuario;
}

type OmitirCreate = '_id' | 'evento' | 'usuario';

export interface ICreateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'evento' | 'usuario';

export interface IUpdateTratamientoEvento
  extends Omit<Partial<ITratamientoEvento>, OmitirUpdate> {}
